import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@bmms/db';
import { EventModule } from '@bmms/event';
import { OrderSvcController } from './order-svc.controller';
import { OrderSvcService } from './order-svc.service';
import { OrderEventListener } from './order.event-listener';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule.forRoot({ prefix: 'ORDER_SVC' }),
    EventModule.forRoot({
      clientId: 'order-svc',
      consumerGroupId: 'order-group',
    }),
  ],
  controllers: [OrderSvcController],
  providers: [OrderSvcService, OrderEventListener],
})
export class OrderSvcModule {}