import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private nullToUndefined<T>(value: T | null): T | undefined {
    return value === null ? undefined : value;
  }

  async findAll(currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view all users');
    }

    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, currentUserRole: UserRole, currentUserId: string) {
    if (currentUserRole !== UserRole.ADMIN && id !== currentUserId) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserRole: UserRole, currentUserId: string) {
    if (currentUserRole !== UserRole.ADMIN && id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (currentUserRole !== UserRole.ADMIN) {
      const { role, status, isVerified, ...safeUpdate } = updateUserDto;
      updateUserDto = safeUpdate as any;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      lastName: this.nullToUndefined(user.lastName),
      phone: this.nullToUndefined(user.phone),
    };
  }

  async remove(id: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  async changeStatus(id: string, status: string, currentUserRole: UserRole) {
    if (currentUserRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can change user status');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { status: status as any },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    return {
      ...user,
      lastName: this.nullToUndefined(user.lastName),
    };
  }
}
