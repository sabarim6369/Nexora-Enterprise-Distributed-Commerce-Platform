import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, WarehousesModule, InventoryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
