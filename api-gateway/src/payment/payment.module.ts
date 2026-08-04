import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentClientService } from './services/payment-client.service';
import { CommonModule } from '../common/common.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [ConfigModule, CommonModule, AuthenticationModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentClientService],
  exports: [PaymentService],
})
export class PaymentModule {}
