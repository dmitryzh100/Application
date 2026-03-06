import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Tag } from '../entities/tag.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class TagRepository extends BaseRepository<Tag> {
  constructor(
    @InjectRepository(Tag)
    repository: Repository<Tag>,
  ) {
    super(repository);
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    return await this.repository.find({ where: { id: In(ids) } });
  }

  async findByName(name: string): Promise<Tag | null> {
    return await this.repository.findOne({
      where: { name: name.toLowerCase() },
    });
  }

  async findAll(): Promise<Tag[]> {
    return await this.repository.find({ order: { name: 'ASC' } });
  }

  async findOrCreate(name: string): Promise<Tag> {
    const normalized = name.toLowerCase().trim();
    const existing = await this.findByName(normalized);

    if (existing) {
      return existing;
    }

    return await this.repository.save(this.repository.create({ name: normalized }));
  }
}
