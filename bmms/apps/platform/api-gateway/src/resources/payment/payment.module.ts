import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { paymentGrpcOptions } from '../../client-options/payment.grpc-client';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [ClientsModule.register([paymentGrpcOptions])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
