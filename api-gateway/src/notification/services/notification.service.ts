import { Injectable } from '@nestjs/common';
import { NotificationClientService } from './notification-client.service';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationClientService: NotificationClientService) {}

  async sendNotification(data: any) {
    return this.notificationClientService.sendNotification(data);
  }

  async getNotificationById(id: string) {
    return this.notificationClientService.getNotificationById(id);
  }

  async getUserNotifications(userId: string, filters?: any) {
    return this.notificationClientService.getUserNotifications(userId, filters);
  }

  async markAsRead(id: string) {
    return this.notificationClientService.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return this.notificationClientService.markAllAsRead(userId);
  }

  async deleteNotification(id: string) {
    return this.notificationClientService.deleteNotification(id);
  }

  async getNotificationPreferences(userId: string) {
    return this.notificationClientService.getNotificationPreferences(userId);
  }

  async updateNotificationPreferences(userId: string, data: any) {
    return this.notificationClientService.updateNotificationPreferences(userId, data);
  }
}
