import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { User } from '../entities/user.entity';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'event_management',
    entities: [User, Event, Participant],
    synchronize: true,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
}
