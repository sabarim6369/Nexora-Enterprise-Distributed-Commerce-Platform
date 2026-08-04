import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post()
  async sendNotification(@Body() data: any) {
    return this.notificationService.sendNotification(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string, @Query() filters?: any) {
    return this.notificationService.getUserNotifications(userId, filters);
  }

  @UseGuards(AuthGuard)
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @UseGuards(AuthGuard)
  @Put('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }

  @UseGuards(AuthGuard)
  @Get('preferences/:userId')
  async getNotificationPreferences(@Param('userId') userId: string) {
    return this.notificationService.getNotificationPreferences(userId);
  }

  @UseGuards(AuthGuard)
  @Put('preferences/:userId')
  async updateNotificationPreferences(@Param('userId') userId: string, @Body() data: any) {
    return this.notificationService.updateNotificationPreferences(userId, data);
  }
}
