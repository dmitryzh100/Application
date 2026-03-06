import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { DatabaseModule } from '@event-management/database';

import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { AuthModule } from '@/modules/auth/auth.module';
import { EventsModule } from '@/modules/events/events.module';
import { TagsModule } from '@/modules/tags/tags.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, EventsModule, TagsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
