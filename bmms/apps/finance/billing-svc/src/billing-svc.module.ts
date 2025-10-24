import { Module } from '@nestjs/common';
import { BillingController } from './billing-svc.controller';
import { BillingService } from './billing-svc.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { Invoice } from './entities/invoice.entity';
import { InvoiceHistory } from './entities/invoice-history.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { DbModule } from '@bmms/db';
import { EventModule } from '@bmms/event';
import { PaymentRecord } from './entities/payment-record.entity';
import { BillingEventListener } from './billing.event-listener';
import { getOrderGrpcClientOptions } from './client-options/order.grpc-client';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        // Tự động load .env từ root
      }),
      TypeOrmModule.forFeature([Invoice,InvoiceHistory,InvoiceItem,PaymentRecord]), 
      DbModule.forRoot({ prefix: 'BILLING_SVC' }),
      EventModule.forRoot({
        clientId: 'billing-svc',
        consumerGroupId: 'billing-group',
      }),
      ClientsModule.register([getOrderGrpcClientOptions()]),
    ],
  controllers: [BillingController,BillingEventListener],
  providers: [BillingService],
})
export class BillingSvcModule {}
