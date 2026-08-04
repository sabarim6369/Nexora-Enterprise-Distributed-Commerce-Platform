import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(@Body() data: any) {
    return this.notificationService.sendNotification(data);
  }

  @Get(':id')
  async getNotificationById(@Param('id') id: string) {
    return this.notificationService.getNotificationById(id);
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string, @Query() filters?: any) {
    return this.notificationService.getUserNotifications(userId, filters);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Put('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }

  @Get('preferences/:userId')
  async getNotificationPreferences(@Param('userId') userId: string) {
    return this.notificationService.getNotificationPreferences(userId);
  }

  @Put('preferences/:userId')
  async updateNotificationPreferences(@Param('userId') userId: string, @Body() data: any) {
    return this.notificationService.updateNotificationPreferences(userId, data);
  }
}
