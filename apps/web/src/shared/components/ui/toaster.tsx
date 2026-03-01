import { Toaster as Sonner } from 'sonner';

export const Toaster = (): React.ReactElement => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          error: '!bg-[var(--color-destructive)] !text-white !border-[var(--color-destructive)]',
        },
      }}
    />
  );
};
