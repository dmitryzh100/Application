import Markdown from 'react-markdown';

import type { UIMessage } from 'ai';
import { Bot, User } from 'lucide-react';
import remarkGfm from 'remark-gfm';

import { ChatRole } from '../constants/chat.constants';

interface ChatMessageBubbleProps {
  message: UIMessage;
}

export const ChatMessageBubble = (props: ChatMessageBubbleProps): React.ReactElement => {
  const { message } = props;
  const isUser = message.role === ChatRole.USER;

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <Bot className="text-primary h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
            : 'bg-muted prose prose-sm dark:prose-invert max-w-none'
        }`}
      >
        {message.parts?.map((part, i) =>
          part.type === 'text' ? (
            isUser ? (
              <span key={i}>{part.text}</span>
            ) : (
              <Markdown key={i} remarkPlugins={[remarkGfm]}>
                {part.text}
              </Markdown>
            )
          ) : null,
        )}
      </div>

      {isUser && (
        <div className="bg-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
