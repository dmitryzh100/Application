import { Link } from 'react-router-dom';

import { CalendarDays } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Typography } from '@/shared/components/ui/typography';
import { Routes } from '@/shared/constants/routes.constants';

export const CalendarEmptyView = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <CalendarDays className="text-muted-foreground mb-4 h-12 w-12" aria-hidden="true" />
      <Typography variant="lead">You are not part of any events yet.</Typography>
      <Typography variant="muted" className="mb-4">
        Explore public events and join.
      </Typography>
      <Button asChild>
        <Link to={Routes.events}>Browse Events</Link>
      </Button>
    </div>
  );
};
