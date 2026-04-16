import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Expose prisma methods
  get user() {
    return this.prisma.user;
  }

  get ticket() {
    return this.prisma.ticket;
  }

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    this.logger.log('Prisma disconnected');
  }
}
