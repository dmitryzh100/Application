import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="public">
      <Label className="flex cursor-pointer items-center gap-2 font-normal">
        <RadioGroupItem value="public" />
        Public
      </Label>
      <Label className="flex cursor-pointer items-center gap-2 font-normal">
        <RadioGroupItem value="private" />
        Private
      </Label>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="public" className="flex gap-4">
      <Label className="flex cursor-pointer items-center gap-2 font-normal">
        <RadioGroupItem value="public" />
        Public
      </Label>
      <Label className="flex cursor-pointer items-center gap-2 font-normal">
        <RadioGroupItem value="private" />
        Private
      </Label>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState('public');

    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue} className="flex gap-4">
          <Label className="flex cursor-pointer items-center gap-2 font-normal">
            <RadioGroupItem value="public" />
            Public
          </Label>
          <Label className="flex cursor-pointer items-center gap-2 font-normal">
            <RadioGroupItem value="private" />
            Private
          </Label>
        </RadioGroup>
        <p className="text-muted-foreground text-sm">Selected: {value}</p>
      </div>
    );
  },
};
