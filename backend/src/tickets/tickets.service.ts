import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: string) {
    // Get user info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Create ticket
    const ticket = await this.prisma.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        priority: createTicketDto.priority as any || 'MEDIUM',
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        userId: true,
        assignedToId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Send notifications to all support staff
    const supportStaff = await this.prisma.user.findMany({
      where: { isSupport: true },
    });

    for (const staff of supportStaff) {
      // Send email notification
      if (staff.email) {
        await this.notificationsService.sendTicketNotificationEmail(
          staff.email,
          {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description ?? undefined,
            priority: ticket.priority,
            createdBy: user?.email || 'Usuario Desconocido',
          },
        );
      }

      // Send WhatsApp notification
      if (staff.phone) {
        await this.notificationsService.sendTicketNotificationWhatsApp(
          staff.phone,
          {
            id: ticket.id,
            title: ticket.title,
            priority: ticket.priority,
          },
        );
      }
    }

    return ticket;
  }

  async findAll(userId: string, role?: string, isSupport?: boolean) {
    // Admins see ALL tickets
    // Support staff see tickets assigned to them
    // Regular users see their created tickets + assigned to them
    let whereCondition: any;

    if (role === 'ADMIN') {
      // Admin sees all tickets without filter
      whereCondition = undefined;
    } else if (isSupport) {
      // Support staff sees tickets assigned to them + created tickets
      whereCondition = {
        OR: [
          { assignedToId: userId },
          { userId }, // Can also see their own tickets if created
        ],
      };
    } else {
      // Regular users see their own tickets + tickets assigned to them
      whereCondition = {
        OR: [
          { userId },
          { assignedToId: userId },
        ],
      };
    }

    return this.prisma.ticket.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        userId: true,
        assignedToId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, role?: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        userId: true,
        assignedToId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Admins can see any ticket
    if (role === 'ADMIN') {
      return ticket;
    }

    // Others can only see tickets they created or are assigned to
    if (ticket.userId !== userId && ticket.assignedToId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, userId: string, role?: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Admins can update any ticket
    // Support staff can update tickets assigned to them
    // Users can update their own tickets
    if (role !== 'ADMIN' && ticket.assignedToId !== userId && ticket.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this ticket');
    }

    // Update history
    const history = ticket.history ? [...ticket.history as any[], {
      status: updateTicketDto.status,
      date: new Date(),
      by: userId,
    }] : [{
      status: updateTicketDto.status,
      date: new Date(),
      by: userId,
    }];

    const updateData: any = { history };

    if (updateTicketDto.status) updateData.status = updateTicketDto.status;
    if (updateTicketDto.assignedToId) updateData.assignedToId = updateTicketDto.assignedToId;

    return this.prisma.ticket.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        status: true,
        userId: true,
        assignedToId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.ticket.delete({ where: { id } });
  }
}
