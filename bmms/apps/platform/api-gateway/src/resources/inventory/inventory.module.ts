import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getInventoryGrpcClientOptions } from '../../client-options/inventory.grpc-client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INVENTORY_PACKAGE',
        imports: [ConfigModule],
        useFactory: getInventoryGrpcClientOptions,
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule { }
