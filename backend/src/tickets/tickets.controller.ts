import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../types/user.type';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body(ValidationPipe) createTicketDto: CreateTicketDto, @Req() req: { user: CurrentUser }) {
    return this.ticketsService.create(createTicketDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: { user: CurrentUser & { role?: string; isSupport?: boolean } }) {
    return this.ticketsService.findAll(req.user.id, req.user.role, req.user.isSupport);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: CurrentUser }) {
    return this.ticketsService.findOne(id, req.user.id, req.user.role);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateTicketDto: UpdateTicketDto, @Req() req: { user: CurrentUser }) {
    return this.ticketsService.update(id, updateTicketDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: CurrentUser }) {
    return this.ticketsService.remove(id, req.user.id);
  }
}

