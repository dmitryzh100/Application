import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/shared/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'tech',
  },
};

export const Secondary: Story = {
  args: {
    children: 'art',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'urgent',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'music',
    variant: 'outline',
  },
};

export const TagList: Story = {
  render: () => (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="secondary">tech</Badge>
      <Badge variant="secondary">art</Badge>
      <Badge variant="secondary">business</Badge>
      <Badge variant="secondary">music</Badge>
      <Badge variant="secondary">design</Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
