import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Participant } from '../entities/participant.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ParticipantRepository extends BaseRepository<Participant> {
  constructor(
    @InjectRepository(Participant)
    repository: Repository<Participant>,
  ) {
    super(repository);
  }

  async findByUserAndEvent(userId: string, eventId: string): Promise<Participant | null> {
    return await this.repository.findOne({ where: { userId, eventId } });
  }

  async deleteByUserAndEvent(userId: string, eventId: string): Promise<void> {
    await this.repository.delete({ userId, eventId });
  }
}
