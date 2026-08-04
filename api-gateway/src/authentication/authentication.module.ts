import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PublicGuard } from './guards/public.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { AuthController } from './controllers/auth.controller';
import { AuthClientService } from './services/auth-client.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => CommonModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key-change-in-production',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m' as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PublicGuard,
    AuthClientService,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    PublicGuard,
  ],
})
export class AuthenticationModule {}
