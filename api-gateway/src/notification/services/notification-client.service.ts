import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class NotificationClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('NOTIFICATION_SERVICE_URL') || 'http://localhost:3007';
  }

  async sendNotification(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/notifications`, data);
  }

  async getNotificationById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/notifications/${id}`);
  }

  async getUserNotifications(userId: string, filters?: any) {
    return this.baseHttpClient.get(`${this.baseUrl}/notifications/user/${userId}`, { params: filters });
  }

  async markAsRead(id: string) {
    return this.baseHttpClient.put(`${this.baseUrl}/notifications/${id}/read`);
  }

  async markAllAsRead(userId: string) {
    return this.baseHttpClient.put(`${this.baseUrl}/notifications/user/${userId}/read-all`);
  }

  async deleteNotification(id: string) {
    return this.baseHttpClient.delete(`${this.baseUrl}/notifications/${id}`);
  }

  async getNotificationPreferences(userId: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/notifications/preferences/${userId}`);
  }

  async updateNotificationPreferences(userId: string, data: any) {
    return this.baseHttpClient.put(`${this.baseUrl}/notifications/preferences/${userId}`, data);
  }
}
