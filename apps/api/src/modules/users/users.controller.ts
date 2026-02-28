import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import type { User } from '@event-management/database';
import type { EventWithDetails } from '@event-management/shared';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { serializeEvent } from '@/modules/events/events.serializer';
import { EventsService } from '@/modules/events/events.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('me/events')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get current user events (calendar)' })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getMyEvents(
    @CurrentUser() user: User,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<EventWithDetails[]> {
    const monthNum = month ? parseInt(month, 10) : undefined;
    const yearNum = year ? parseInt(year, 10) : undefined;
    const events = await this.eventsService.findUserEvents(user.id, monthNum, yearNum);

    return events.map(serializeEvent);
  }
}
