import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { Logger, pino } from 'pino';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private readonly logger: Logger;
  private context?: string;

  constructor(private readonly configService: ConfigService) {
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    
    this.logger = pino({
      level: this.configService.get<string>('LOG_LEVEL') || 'info',
      transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          headers: req.headers,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
    });
  }

  log(message: any, context?: string) {
    this.logger.info({ context: context || this.context }, message);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ context: context || this.context, trace }, message);
  }

  warn(message: any, context?: string) {
    this.logger.warn({ context: context || this.context }, message);
  }

  debug(message: any, context?: string) {
    this.logger.debug({ context: context || this.context }, message);
  }

  verbose(message: any, context?: string) {
    this.logger.trace({ context: context || this.context }, message);
  }

  setContext(context: string) {
    this.context = context;
  }
}
