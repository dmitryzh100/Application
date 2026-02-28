import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-2xl font-bold tracking-tight',
      h2: 'text-lg font-semibold tracking-tight',
      h3: 'text-sm font-medium',
      h4: 'text-sm font-medium',
      p: '',
      lead: 'text-lg font-medium text-muted-foreground',
      large: 'text-lg',
      small: 'text-sm',
      muted: 'text-sm text-muted-foreground',
      error: 'text-sm text-destructive',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type VariantKey = NonNullable<VariantProps<typeof typographyVariants>['variant']>;

type ElementTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

const defaultElements: Record<VariantKey, ElementTag> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  lead: 'p',
  large: 'p',
  small: 'p',
  muted: 'p',
  error: 'p',
};

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  as?: ElementTag;
  children: React.ReactNode;
  className?: string;
}

export const Typography = (props: TypographyProps): React.ReactElement => {
  const { variant = 'p', as, children, className } = props;
  const Element = as ?? defaultElements[variant!];

  return <Element className={cn(typographyVariants({ variant }), className)}>{children}</Element>;
};

export { typographyVariants };
