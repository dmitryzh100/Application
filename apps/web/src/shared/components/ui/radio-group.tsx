import * as React from 'react';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CircleIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const RadioGroup = (
  props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    ref?: React.Ref<React.ComponentRef<typeof RadioGroupPrimitive.Root>>;
  },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return <RadioGroupPrimitive.Root className={cn('grid gap-3', className)} ref={ref} {...rest} />;
};

const RadioGroupItem = (
  props: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    ref?: React.Ref<React.ComponentRef<typeof RadioGroupPrimitive.Item>>;
  },
): React.ReactElement => {
  const { className, ref, ...rest } = props;

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 shadow-xs aspect-square size-4 shrink-0 rounded-full border outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
        <CircleIcon className="fill-primary absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
};

export { RadioGroup, RadioGroupItem };
