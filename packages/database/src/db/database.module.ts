import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { Tag } from '../entities/tag.entity';
import { User } from '../entities/user.entity';
import { EventRepository } from '../repositories/event.repository';
import { ParticipantRepository } from '../repositories/participant.repository';
import { TagRepository } from '../repositories/tag.repository';
import { UserRepository } from '../repositories/user.repository';
import { getDatabaseConfig } from './database.config';
import { SeederService } from './seeder.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([User, Event, Participant, Tag]),
  ],
  providers: [UserRepository, EventRepository, ParticipantRepository, TagRepository, SeederService],
  exports: [UserRepository, EventRepository, ParticipantRepository, TagRepository, TypeOrmModule],
})
export class DatabaseModule {}
