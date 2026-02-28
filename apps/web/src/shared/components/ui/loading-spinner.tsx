import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = (props: LoadingSpinnerProps): React.ReactElement => {
  const { className } = props;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex items-center justify-center py-16', className)}
    >
      <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden="true" />
    </div>
  );
};
