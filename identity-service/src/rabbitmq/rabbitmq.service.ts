import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  async publishUserCreatedEvent(userData: any) {
    try {
      this.logger.log(`Publishing user created event for user: ${userData.email}`);
      await this.client.emit('user.created', userData).toPromise();
      this.logger.log(`User created event published successfully`);
    } catch (error) {
      this.logger.error(`Error publishing user created event: ${error.message}`);
      throw error;
    }
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('RabbitMQ client connected successfully');
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('RabbitMQ client disconnected');
  }
}
