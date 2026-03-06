import type { Meta, StoryObj } from '@storybook/react-vite';

import { Typography } from '@/shared/components/ui/typography';

const meta: Meta<typeof Typography> = {
  title: 'UI/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'lead', 'large', 'small', 'muted', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Events',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Event Details',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Section Title',
  },
};

export const Paragraph: Story = {
  args: {
    variant: 'p',
    children: 'This is a paragraph of text describing an event.',
  },
};

export const Lead: Story = {
  args: {
    variant: 'lead',
    children: 'A lead paragraph for important introductory text.',
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: 'Organized by John Doe',
  },
};

export const ErrorText: Story = {
  args: {
    variant: 'error',
    children: 'Title is required',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="p">Paragraph text</Typography>
      <Typography variant="lead">Lead text</Typography>
      <Typography variant="large">Large text</Typography>
      <Typography variant="small">Small text</Typography>
      <Typography variant="muted">Muted text</Typography>
      <Typography variant="error">Error text</Typography>
    </div>
  ),
};
