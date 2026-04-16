import { Controller, Get, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../types/user.type';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users (Admin only)
  @Get()
  async findAll(@Req() req: { user: CurrentUser }) {
    // Verify user is ADMIN
    const currentUser = await this.usersService.findOne(req.user.id);
    if (currentUser?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view all users');
    }
    return this.usersService.findAll();
  }

  // Get support staff (accessible to all authenticated users)
  @Get('support/list')
  async findSupportStaff() {
    return this.usersService.findSupportStaff();
  }

  // Get specific user
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: { user: CurrentUser }) {
    const user = await this.usersService.findOne(id);
    
    // Allow users to see their own info, or admins to see anyone
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    return user;
  }
}
