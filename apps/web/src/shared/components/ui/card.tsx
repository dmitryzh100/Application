import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Card = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn('bg-card text-card-foreground rounded-xl border shadow', className)}
      {...rest}
    />
  );
};

const CardHeader = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...rest} />;
};

const CardTitle = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...rest}
    />
  );
};

const CardDescription = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return <div ref={ref} className={cn('text-muted-foreground text-sm', className)} {...rest} />;
};

const CardContent = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return <div ref={ref} className={cn('p-6 pt-0', className)} {...rest} />;
};

const CardFooter = (
  props: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...rest} />;
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
