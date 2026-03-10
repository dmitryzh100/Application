import { Bot } from 'lucide-react';

export const ChatThinkingIndicator = (): React.ReactElement => {
  return (
    <div className="flex gap-3">
      <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <Bot className="text-primary h-4 w-4" />
      </div>
      <div className="bg-muted rounded-lg px-4 py-2 text-sm">
        <span className="animate-pulse">Thinking...</span>
      </div>
    </div>
  );
};
