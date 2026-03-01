import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Event } from './event.entity';
import { User } from './user.entity';

@Entity('participants')
export class Participant {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  eventId!: string;

  @ManyToOne(() => User, (user) => user.participations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Event, (event) => event.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @CreateDateColumn()
  joinedAt!: Date;
}
