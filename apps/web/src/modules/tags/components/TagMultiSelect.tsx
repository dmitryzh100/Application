import { Suspense } from 'react';

import { X } from 'lucide-react';

import type { TagBase } from '@event-management/shared';

import { Badge } from '@/shared/components/ui/badge';

import { useTagsSuspense } from '../hooks/useTagsQueries';

interface TagMultiSelectProps {
  value: string[];
  onChange: (tagIds: string[]) => void;
  max?: number;
}

const TagMultiSelectContent = (props: TagMultiSelectProps): React.ReactElement => {
  const { value, onChange, max = 5 } = props;
  const { data: tags } = useTagsSuspense();

  const selectedTags = tags.filter((t) => value.includes(t.id));
  const availableTags = tags.filter((t) => !value.includes(t.id));
  const isMaxReached = value.length >= max;

  const handleAdd = (tag: TagBase): void => {
    if (!isMaxReached) {
      onChange([...value, tag.id]);
    }
  };

  const handleRemove = (tagId: string): void => {
    onChange(value.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-2">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="default" className="gap-1">
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemove(tag.id)}
                className="hover:bg-primary-foreground/20 ml-0.5 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className={
                isMaxReached ? 'cursor-not-allowed opacity-50' : 'hover:bg-secondary cursor-pointer'
              }
              onClick={() => !isMaxReached && handleAdd(tag)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {isMaxReached && <p className="text-muted-foreground text-xs">Maximum {max} tags allowed</p>}
    </div>
  );
};

export const TagMultiSelect = (props: TagMultiSelectProps): React.ReactElement => {
  return (
    <Suspense
      fallback={<div className="text-muted-foreground flex gap-1.5 text-sm">Loading tags...</div>}
    >
      <TagMultiSelectContent {...props} />
    </Suspense>
  );
};
