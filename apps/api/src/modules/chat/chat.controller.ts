import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UIMessage } from 'ai';
import type { Response } from 'express';

import type { User } from '@event-management/database';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ChatService } from './chat.service';

interface ChatRequestDto {
  messages: UIMessage[];
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Stream AI assistant response about your events' })
  async chat(
    @Body() body: ChatRequestDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    await this.chatService.handleChatStream(body.messages, user, res);
  }
}
