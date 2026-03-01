import { useFormStatus } from 'react-dom';

import { Button } from './button';

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingText: string;
  className?: string;
}

export const SubmitButton = (props: SubmitButtonProps): React.ReactElement => {
  const { children, pendingText, className } = props;
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
};
