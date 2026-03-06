import { Bot } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Typography } from '@/shared/components/ui/typography';

import { CHAT_SUGGESTIONS } from '../constants/chat.constants';

interface ChatEmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
  disabled: boolean;
}

export const ChatEmptyState = (props: ChatEmptyStateProps): React.ReactElement => {
  const { onSuggestionClick, disabled } = props;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Bot className="text-muted-foreground h-12 w-12" />
      <Typography variant="muted" className="text-center">
        Ask me anything about your events!
      </Typography>
      <div className="flex flex-wrap justify-center gap-2">
        {CHAT_SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
