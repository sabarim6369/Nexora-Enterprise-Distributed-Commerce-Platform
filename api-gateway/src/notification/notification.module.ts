import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationClientService } from './services/notification-client.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationClientService],
  exports: [NotificationService],
})
export class NotificationModule {}
