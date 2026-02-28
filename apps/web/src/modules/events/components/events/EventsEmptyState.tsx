import { Typography } from '@/shared/components/ui/typography';

export const EventsEmptyState = (): React.ReactElement => {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
      <Typography variant="large">No events found</Typography>
      <Typography variant="small">Try adjusting your search or check back later.</Typography>
    </div>
  );
};
