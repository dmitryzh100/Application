import { getDisplayName, getInitial, type ParticipantInfo } from '@event-management/shared';

import { Typography } from '@/shared/components/ui/typography';

interface ParticipantListProps {
  participants: ParticipantInfo[];
}

export const EventsParticipantList = (props: ParticipantListProps): React.ReactElement => {
  const { participants } = props;

  if (!participants.length) {
    return <Typography variant="muted">No participants yet.</Typography>;
  }

  return (
    <div className="space-y-2">
      <Typography variant="h3">Participants ({participants.length})</Typography>
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="bg-muted flex items-center gap-2 rounded-full px-3 py-1 text-sm"
          >
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs">
              {getInitial(p.name || p.email)}
            </div>
            <span>{getDisplayName(p.name, p.email)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
