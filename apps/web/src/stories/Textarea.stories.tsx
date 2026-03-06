import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Describe your event...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Describe your event" rows={4} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
    rows: 3,
  },
};
