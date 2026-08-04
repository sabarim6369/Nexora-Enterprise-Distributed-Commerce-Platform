import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BaseHttpClient } from './services/base-http-client.service';
import { UserContextService } from './services/user-context.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        timeout: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
        maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS || '5', 10),
        // keepAlive: true, // Uncomment if using axios with keep-alive support
      }),
    }),
    ConfigModule,
    forwardRef(() => AuthenticationModule),
  ],
  providers: [BaseHttpClient, UserContextService, AuthGuard],
  exports: [BaseHttpClient, UserContextService, AuthGuard, HttpModule],
})
export class CommonModule {}
