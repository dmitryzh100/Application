import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Event Title',
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="event-title">Event Title *</Label>
      <Input id="event-title" placeholder="Enter event title" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <Label htmlFor="f1">Title *</Label>
        <Input id="f1" placeholder="Required field" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="f2">Description</Label>
        <Input id="f2" placeholder="Optional field" />
      </div>
    </div>
  ),
};
