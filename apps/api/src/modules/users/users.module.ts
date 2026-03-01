import { forwardRef, Module } from '@nestjs/common';

import { EventsModule } from '@/modules/events/events.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => EventsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
