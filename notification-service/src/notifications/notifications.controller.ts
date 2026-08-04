import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from '../email/email.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(@Query() query: QueryNotificationDto) {
    return this.notificationsService.findAll(query);
  }

  @Get('statistics')
  getStatistics() {
    return this.notificationsService.getStatistics();
  }

  @Get('recipient/:recipient')
  findByRecipient(@Param('recipient') recipient: string) {
    return this.notificationsService.findByRecipient(recipient);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.notificationsService.update(id, updateData);
  }

  @Patch(':id/retry')
  retry(@Param('id') id: string) {
    return this.notificationsService.retryFailedNotification(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }

  @Post('email/send')
  sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto);
  }

  @Post('email/order-confirmation')
  sendOrderConfirmation(@Body() orderData: any) {
    return this.notificationsService.sendOrderConfirmation(orderData);
  }

  @Post('email/shipping-notification')
  sendShippingNotification(@Body() orderData: any) {
    return this.notificationsService.sendShippingNotification(orderData);
  }

  @Post('email/password-reset')
  sendPasswordReset(@Body() data: { email: string; resetToken: string }) {
    return this.notificationsService.sendPasswordReset(data.email, data.resetToken);
  }

  @Post('email/welcome')
  sendWelcomeEmail(@Body() data: { email: string; userName: string; userId?: string }) {
    return this.notificationsService.sendWelcomeEmail(data.email, data.userName, data.userId);
  }

  @Get('email/verify')
  verifyEmailConnection() {
    return this.emailService.verifyConnection();
  }
}
