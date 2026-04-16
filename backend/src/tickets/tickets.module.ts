import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [PrismaModule, NotificationsModule],
})
export class TicketsModule {}
