import { Module } from '@nestjs/common';
import { InventoryController } from './inventory-svc.controller';
import { InventoryService } from './inventory-svc.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { DbModule } from '@bmms/db';
import { EventModule } from '@bmms/event';
import { Inventory } from './entities/inventory.entity';
import { InventoryReservation } from './entities/inventory-reservation.entity';
import { InventoryHistory } from './entities/inventory-history.entity';
import { InventoryEventListener } from './inventory.event-listener';
import { getCatalogueGrpcClientOptions } from './client-options/catalogue.grpc-client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Tự động load .env từ root
    }),
    TypeOrmModule.forFeature([Inventory, InventoryReservation, InventoryHistory]),
    DbModule.forRoot({ prefix: 'INVENTORY_SVC' }),
    EventModule.forRoot({
      clientId: 'inventory-svc',
      consumerGroupId: 'inventory-group',
    }),
    ClientsModule.registerAsync([
      {
        name: 'CATALOGUE_PACKAGE',
        imports: [ConfigModule],
        useFactory: getCatalogueGrpcClientOptions,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventoryController, InventoryEventListener],
  providers: [InventoryService],
})
export class InventorySvcModule { }
