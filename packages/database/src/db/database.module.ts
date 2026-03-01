import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { User } from '../entities/user.entity';
import { EventRepository } from '../repositories/event.repository';
import { ParticipantRepository } from '../repositories/participant.repository';
import { UserRepository } from '../repositories/user.repository';
import { getDatabaseConfig } from './database.config';
import { SeederService } from './seeder.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([User, Event, Participant]),
  ],
  providers: [UserRepository, EventRepository, ParticipantRepository, SeederService],
  exports: [UserRepository, EventRepository, ParticipantRepository, TypeOrmModule],
})
export class DatabaseModule {}
