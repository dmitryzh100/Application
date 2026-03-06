import { createGroq } from '@ai-sdk/groq';
import { get_encoding, type Tiktoken } from '@dqbd/tiktoken';
import { BadRequestException, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import type { Response } from 'express';

import type { Event, User } from '@event-management/database';
import { hasRole } from '@event-management/shared';

import { getEnv } from '@/common/config/env.validation';
import { EventsService } from '@/modules/events/events.service';

import { buildSystemPrompt, MAX_MESSAGE_LENGTH, MAX_MESSAGES } from './chat.constants';

@Injectable()
export class ChatService implements OnModuleDestroy {
  private readonly logger = new Logger(ChatService.name);
  private readonly encoder: Tiktoken;

  constructor(private readonly eventsService: EventsService) {
    this.encoder = get_encoding('cl100k_base');
  }

  onModuleDestroy(): void {
    this.encoder.free();
  }

  async handleChatStream(messages: UIMessage[], user: User, res: Response): Promise<void> {
    const env = getEnv();

    if (!env.GROQ_API_KEY) {
      this.logger.error('GROQ_API_KEY is not configured');
      throw new BadRequestException('AI Assistant is not configured');
    }

    const sanitized = this.sanitizeMessages(messages);
    this.validateInputTokens(sanitized, env.GROQ_MAX_INPUT_TOKENS);

    const groq = createGroq({ apiKey: env.GROQ_API_KEY });
    const events = await this.eventsService.findUserEvents(user.id);
    const systemPrompt = this.getSystemPrompt(user, events);

    const result = streamText({
      model: groq(env.GROQ_MODEL),
      system: systemPrompt,
      messages: await convertToModelMessages(sanitized),
      temperature: env.GROQ_TEMPERATURE,
      maxOutputTokens: env.GROQ_MAX_TOKENS,
    });

    result.pipeUIMessageStreamToResponse(res);
  }

  private sanitizeMessages(messages: UIMessage[]): UIMessage[] {
    if (!Array.isArray(messages) || !messages.length) {
      throw new BadRequestException('Messages array is required and must not be empty');
    }

    if (messages.length > MAX_MESSAGES) {
      throw new BadRequestException(`Too many messages. Maximum is ${MAX_MESSAGES}`);
    }

    return messages.reduce<UIMessage[]>((acc, msg) => {
      if (!hasRole(msg.role)) {
        return acc;
      }

      const parts = msg.parts?.map((part) =>
        part.type === 'text' ? { ...part, text: part.text.slice(0, MAX_MESSAGE_LENGTH) } : part,
      );

      acc.push({ ...msg, parts });

      return acc;
    }, []);
  }

  private countTokens(text: string): number {
    return this.encoder.encode(text).length;
  }

  private validateInputTokens(messages: UIMessage[], maxInputTokens: number): void {
    const inputText = messages
      .flatMap((msg) => msg.parts ?? [])
      .reduce((acc, part) => (part.type === 'text' ? acc + '\n' + part.text : acc), '');

    const tokenCount = this.countTokens(inputText);

    if (tokenCount > maxInputTokens) {
      throw new BadRequestException(
        `Input exceeds the maximum allowed token count (${tokenCount}/${maxInputTokens})`,
      );
    }
  }

  private getSystemPrompt(user: User, events: Event[]): string {
    const userName = user.name || user.email;

    const eventsSnapshot = events.map((e) => ({
      title: e.title,
      description: e.description,
      dateTime: e.dateTime?.toISOString(),
      location: e.location,
      capacity: e.capacity,
      visibility: e.visibility,
      isOrganizer: e.organizerId === user.id,
      tags: (e.tags ?? []).map((t) => t.name),
      participants: (e.participants ?? []).map((p) => ({
        name: p.user?.name || p.user?.email || 'Unknown',
        email: p.user?.email || '',
      })),
      participantCount: e.participants?.length ?? 0,
    }));

    return buildSystemPrompt({
      dateTime: new Date().toISOString(),
      userName,
      userEmail: user.email,
      eventsSnapshot: JSON.stringify(eventsSnapshot, null, 2),
    });
  }
}
