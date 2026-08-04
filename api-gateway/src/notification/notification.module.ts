import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationClientService } from './services/notification-client.service';
import { CommonModule } from '../common/common.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [ConfigModule, CommonModule, AuthenticationModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationClientService],
  exports: [NotificationService],
})
export class NotificationModule {}
