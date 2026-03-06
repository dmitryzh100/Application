import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Participant } from './participant.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'timestamptz' })
  dateTime!: Date;

  @Column()
  location!: string;

  @Column({ type: 'int', nullable: true })
  capacity!: number | null;

  @Column({
    type: 'enum',
    enum: EventVisibility,
    default: EventVisibility.PUBLIC,
  })
  visibility!: EventVisibility;

  @Column()
  organizerId!: string;

  @ManyToOne(() => User, (user) => user.organizedEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer!: User;

  @OneToMany(() => Participant, (participant) => participant.event, { cascade: true })
  participants!: Participant[];

  @ManyToMany(() => Tag, { cascade: true, eager: false })
  @JoinTable({
    name: 'event_tags',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
