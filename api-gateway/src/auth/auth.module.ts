import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthClientService } from './services/auth-client.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService, AuthClientService],
  exports: [AuthService],
})
export class AuthModule {}
