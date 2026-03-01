import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Event } from './event.entity';
import { Participant } from './participant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: '' })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents!: Event[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participations!: Participant[];
}
