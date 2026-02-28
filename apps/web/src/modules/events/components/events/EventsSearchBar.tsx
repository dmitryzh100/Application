import { Search } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const EventsSearchBar = (props: SearchBarProps): React.ReactElement => {
  const { value, onChange } = props;

  return (
    <div className="relative">
      <Search
        className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        placeholder="Search events..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};
