import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationStatus, NotificationType } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private emailService: EmailService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    const saved = await notification.save();

    if (saved.type === NotificationType.EMAIL && saved.status === NotificationStatus.PENDING) {
      this.processEmailNotification(saved);
    }

    return saved;
  }

  async findAll(query: QueryNotificationDto): Promise<{ data: Notification[]; total: number }> {
    const filter: any = {};

    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.userId) filter.userId = query.userId;
    if (query.orderId) filter.orderId = query.orderId;
    if (query.recipient) filter.recipient = query.recipient;
    if (query.category) filter.category = query.category;

    const data = await this.notificationModel.find(filter).sort({ createdAt: -1 }).exec();
    const total = await this.notificationModel.countDocuments(filter).exec();

    return { data, total };
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }

  async findByRecipient(recipient: string): Promise<Notification[]> {
    return this.notificationModel.find({ recipient }).sort({ createdAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateData: Partial<Notification>): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async updateStatus(id: string, status: NotificationStatus, errorMessage?: string): Promise<Notification | null> {
    const updateData: any = { status };
    if (errorMessage) updateData.errorMessage = errorMessage;
    if (status === NotificationStatus.SENT) updateData.sentAt = new Date();
    
    return this.update(id, updateData);
  }

  async retryFailedNotification(id: string): Promise<Notification | null> {
    const notification = await this.findOne(id);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.status !== NotificationStatus.FAILED) {
      throw new Error('Can only retry failed notifications');
    }

    const updated = await this.update(id, {
      status: NotificationStatus.RETRYING,
      retryCount: notification.retryCount + 1,
      errorMessage: undefined,
    });

    if (updated && updated.type === NotificationType.EMAIL) {
      const updatedDoc = await this.notificationModel.findById(id).exec();
      if (updatedDoc) {
        this.processEmailNotification(updatedDoc);
      }
    }

    return updated;
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

  async getStatistics(): Promise<{
    total: number;
    pending: number;
    sent: number;
    failed: number;
    byType: Record<string, number>;
  }> {
    const total = await this.notificationModel.countDocuments().exec();
    const pending = await this.notificationModel.countDocuments({ status: NotificationStatus.PENDING }).exec();
    const sent = await this.notificationModel.countDocuments({ status: NotificationStatus.SENT }).exec();
    const failed = await this.notificationModel.countDocuments({ status: NotificationStatus.FAILED }).exec();

    const byType = await this.notificationModel.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const byTypeMap = byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      pending,
      sent,
      failed,
      byType: byTypeMap,
    };
  }

  private async processEmailNotification(notification: NotificationDocument): Promise<void> {
    try {
      const result = await this.emailService.sendEmail({
        to: notification.recipient,
        subject: notification.subject,
        html: notification.content,
      });

      if (result.success) {
        await this.updateStatus(notification._id.toString(), NotificationStatus.SENT);
        this.logger.log(`Email notification ${notification._id.toString()} sent successfully`);
      } else {
        await this.updateStatus(notification._id.toString(), NotificationStatus.FAILED, result.error);
        this.logger.error(`Email notification ${notification._id.toString()} failed: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateStatus(notification._id.toString(), NotificationStatus.FAILED, errorMessage);
      this.logger.error(`Error processing email notification ${notification._id.toString()}: ${errorMessage}`);
    }
  }

  async sendOrderConfirmation(orderData: any): Promise<NotificationDocument> {
    const notification = await this.create({
      type: NotificationType.EMAIL,
      recipient: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      content: '', // Will be generated by email service
      userId: orderData.userId,
      orderId: orderData.orderId,
      category: 'ORDER',
      metadata: orderData,
    });

    await this.emailService.sendOrderConfirmationEmail(orderData.customerEmail, orderData);
    await this.updateStatus((notification as any)._id.toString(), NotificationStatus.SENT);

    return notification as NotificationDocument;
  }

  async sendShippingNotification(orderData: any): Promise<NotificationDocument> {
    const notification = await this.create({
      type: NotificationType.EMAIL,
      recipient: orderData.customerEmail,
      subject: `Order Shipped - ${orderData.orderNumber}`,
      content: '',
      userId: orderData.userId,
      orderId: orderData.orderId,
      category: 'SHIPPING',
      metadata: orderData,
    });

    await this.emailService.sendShippingNotificationEmail(orderData.customerEmail, orderData);
    await this.updateStatus((notification as any)._id.toString(), NotificationStatus.SENT);

    return notification as NotificationDocument;
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<NotificationDocument> {
    const notification = await this.create({
      type: NotificationType.EMAIL,
      recipient: email,
      subject: 'Password Reset Request',
      content: '',
      category: 'AUTH',
      metadata: { resetToken },
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);
    await this.updateStatus((notification as any)._id.toString(), NotificationStatus.SENT);

    return notification as NotificationDocument;
  }

  async sendWelcomeEmail(email: string, userName: string, userId?: string): Promise<NotificationDocument> {
    const notification = await this.create({
      type: NotificationType.EMAIL,
      recipient: email,
      subject: 'Welcome to Nexora!',
      content: '',
      userId,
      category: 'USER',
      metadata: { userName },
    });

    await this.emailService.sendWelcomeEmail(email, userName);
    await this.updateStatus((notification as any)._id.toString(), NotificationStatus.SENT);

    return notification as NotificationDocument;
  }
}
