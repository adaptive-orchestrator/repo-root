import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@bmms/db';
import { CustomerSvcController } from './customer-svc.controller';
import { CustomerSvcService } from './customer-svc.service';
import { EventModule } from '@bmms/event';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Tự động load .env từ root
    }),
    TypeOrmModule.forFeature([Customer]), 
    DbModule.forRoot({ prefix: 'CUSTOMER_SVC' }),
    EventModule.forRoot({
      clientId: 'customer-svc',
      consumerGroupId: 'customer-group',
    }),
  ],
  controllers: [CustomerSvcController],
  providers: [CustomerSvcService],
})
export class CustomerSvcModule {}