import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Request() req) {
    return this.usersService.findAll(req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id, req.user.role, req.user.userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user.role, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  async changeStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.usersService.changeStatus(id, status, req.user.role);
  }
}
