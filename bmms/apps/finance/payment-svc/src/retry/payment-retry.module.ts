import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRetry } from '../entities/payment-retry.entity';
import { PaymentRetryService } from './payment-retry.service';
import { PaymentRetryManager } from './payment-retry.manager';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRetry])],
  providers: [PaymentRetryService, PaymentRetryManager],
  exports: [PaymentRetryManager],
})
export class PaymentRetryModule {}
