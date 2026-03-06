import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Event Title</CardTitle>
        <CardDescription>A brief description of the event.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Event content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Join</Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tech Meetup</CardTitle>
        <CardDescription>Join us for a discussion on latest technologies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">March 15, 2026 at 3:00 PM</p>
        <p className="text-muted-foreground text-sm">San Francisco, CA</p>
        <p className="text-muted-foreground text-sm">5 / 20 participants</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm">Join</Button>
        <Button size="sm" variant="outline">
          Details
        </Button>
      </CardFooter>
    </Card>
  ),
};
