import { useEffect, useRef, useState } from 'react';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Typography } from '@/shared/components/ui/typography';
import { API_BASE_URL } from '@/shared/config/client';
import { Api } from '@/shared/constants/api-routes.constants';

import { ChatEmptyState } from '../components/ChatEmptyState';
import { ChatInput } from '../components/ChatInput';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { ChatThinkingIndicator } from '../components/ChatThinkingIndicator';
import { ChatRole, ChatStatus } from '../constants/chat.constants';

const transport = new DefaultChatTransport({
  api: `${API_BASE_URL}${Api.chat.base}`,
  credentials: 'include',
});

export const ChatPage = (): React.ReactElement => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status === ChatStatus.STREAMING || status === ChatStatus.SUBMITTED;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    const trimmed = input.trim();

    if (!trimmed || isLoading) return;

    sendMessage({ text: trimmed });
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string): void => {
    sendMessage({ text: suggestion });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
      <title>AI Assistant - Event Management</title>

      <Typography variant="h1">AI Assistant</Typography>

      <Card className="flex flex-1 flex-col lg:min-h-0">
        <CardContent className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0">
          <div className="scrollbar-hidden flex-1 space-y-4 overflow-y-auto lg:min-h-0">
            {!messages.length && (
              <ChatEmptyState onSuggestionClick={handleSuggestionClick} disabled={isLoading} />
            )}

            {messages.map((msg) => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && messages[messages.length - 1]?.role === ChatRole.USER && (
              <ChatThinkingIndicator />
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2 text-sm">
                Failed to get a response from the AI assistant. Please try again.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
