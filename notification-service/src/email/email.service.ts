import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const secure = this.configService.get<boolean>('EMAIL_SECURE');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host,
      port: port || 587,
      secure: secure || false,
      auth: {
        user,
        pass,
      },
    });

    this.logger.log('Email transporter initialized');
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: any[];
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const from = options.from || this.configService.get<string>('EMAIL_FROM');
      
      const mailOptions = {
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to ${options.to}. Message ID: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send email to ${options.to}: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async sendOrderConfirmationEmail(
    to: string,
    orderData: any,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
      <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
      <p>We will notify you when your order ships.</p>
    `;

    return this.sendEmail({
      to,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html,
    });
  }

  async sendShippingNotificationEmail(
    to: string,
    orderData: any,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <h1>Your Order Has Shipped!</h1>
      <p>Great news! Your order is on its way.</p>
      <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
      <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
      <p>Expected delivery: ${orderData.estimatedDelivery}</p>
    `;

    return this.sendEmail({
      to,
      subject: `Order Shipped - ${orderData.orderNumber}`,
      html,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html,
    });
  }

  async sendWelcomeEmail(
    to: string,
    userName: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <h1>Welcome to Nexora!</h1>
      <p>Hi ${userName},</p>
      <p>Welcome to Nexora! We're excited to have you as part of our community.</p>
      <p>Start shopping and discover amazing products at great prices.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to Nexora!',
      html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email connection verified successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Email connection verification failed: ${errorMessage}`);
      return false;
    }
  }
}
