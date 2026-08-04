import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WarehouseController, InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryClientService } from './services/inventory-client.service';
import { CommonModule } from '../common/common.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [ConfigModule, CommonModule, AuthenticationModule],
  controllers: [WarehouseController, InventoryController],
  providers: [InventoryService, InventoryClientService],
  exports: [InventoryService],
})
export class InventoryModule {}
