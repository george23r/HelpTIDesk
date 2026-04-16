import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Get all users (Admin only)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isSupport: true,
        createdAt: true,
        _count: {
          select: {
            tickets: true,
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get support staff only
  async findSupportStaff() {
    return this.prisma.user.findMany({
      where: { isSupport: true },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        _count: {
          select: {
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get user by ID
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isSupport: true,
        _count: {
          select: {
            tickets: true,
            assignedTickets: true,
          },
        },
      },
    });
  }
}
