import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BaseHttpClient } from './services/base-http-client.service';

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
  ],
  providers: [BaseHttpClient],
  exports: [BaseHttpClient, HttpModule],
})
export class CommonModule {}
