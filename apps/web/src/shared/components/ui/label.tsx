import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@/shared/lib/utils';

const Label = (
  props: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    ref?: React.Ref<React.ComponentRef<typeof LabelPrimitive.Root>>;
  },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...rest}
    />
  );
};

export { Label };
