import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import type { User } from '@event-management/database';
import {
  createEventSchema,
  updateEventSchema,
  type EventWithDetails,
  type PaginatedResponse,
} from '@event-management/shared';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';
import { YupValidationPipe } from '@/common/pipes/yup-validation.pipe';

import { EventsService } from './events.service';

interface CreateEventDto {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity?: number | null;
  visibility: string;
}

interface UpdateEventDto {
  title?: string;
  description?: string;
  dateTime?: string;
  location?: string;
  capacity?: number | null;
  visibility?: string;
}

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get events (public for guests, all for authenticated users)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 9, max: 50)',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: User,
  ): Promise<PaginatedResponse<EventWithDetails>> {
    return this.eventsService.findEvents(search, user?.id, page, limit);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get event by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: User): Promise<EventWithDetails> {
    return this.eventsService.findOne(id, user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a new event' })
  async create(
    @Body(new YupValidationPipe(createEventSchema)) body: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventWithDetails> {
    return this.eventsService.create(body, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update an event' })
  async update(
    @Param('id') id: string,
    @Body(new YupValidationPipe(updateEventSchema)) body: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventWithDetails> {
    return this.eventsService.update(id, body, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete an event' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ deleted: boolean }> {
    return this.eventsService.delete(id, user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Join an event' })
  async join(@Param('id') id: string, @CurrentUser() user: User): Promise<EventWithDetails> {
    return this.eventsService.join(id, user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Leave an event' })
  async leave(@Param('id') id: string, @CurrentUser() user: User): Promise<EventWithDetails> {
    return this.eventsService.leave(id, user.id);
  }
}
