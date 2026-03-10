import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'datetime-local'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="title">Event Title</Label>
      <Input id="title" placeholder="Enter event title" />
    </div>
  ),
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Capacity',
    min: 1,
  },
};

export const DateTime: Story = {
  args: {
    type: 'datetime-local',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="error-input">Event Title *</Label>
      <Input id="error-input" className="border-destructive" placeholder="Enter event title" />
      <p className="text-destructive text-sm">Title is required</p>
    </div>
  ),
};
