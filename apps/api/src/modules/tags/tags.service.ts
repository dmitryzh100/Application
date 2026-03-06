import { Injectable } from '@nestjs/common';

import { TagRepository, type Tag } from '@event-management/database';
import type { TagBase } from '@event-management/shared';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(): Promise<TagBase[]> {
    const tags = await this.tagRepository.findAll();

    return tags.map((tag: Tag) => ({ id: tag.id, name: tag.name }));
  }
}
