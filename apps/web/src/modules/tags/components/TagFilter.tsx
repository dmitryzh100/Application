import { Suspense } from 'react';

import type { TagBase } from '@event-management/shared';

import { Badge } from '@/shared/components/ui/badge';

import { useTagsSuspense } from '../hooks/useTagsQueries';
import { getTagFilterClasses } from '../utils/tag-colors';

interface TagFilterProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

const TagFilterContent = (props: TagFilterProps): React.ReactElement => {
  const { selectedTagIds, onChange } = props;
  const { data: tags } = useTagsSuspense();

  const handleToggle = (tag: TagBase): void => {
    if (selectedTagIds.includes(tag.id)) {
      onChange(selectedTagIds.filter((id) => id !== tag.id));
    } else {
      onChange([...selectedTagIds, tag.id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);

        return (
          <Badge
            key={tag.id}
            className={`cursor-pointer select-none ${getTagFilterClasses(tag.name, isSelected)}`}
            onClick={() => handleToggle(tag)}
          >
            {tag.name}
          </Badge>
        );
      })}
    </div>
  );
};

export const TagFilter = (props: TagFilterProps): React.ReactElement => {
  return (
    <Suspense fallback={null}>
      <TagFilterContent {...props} />
    </Suspense>
  );
};
