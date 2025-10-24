import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { orderGrpcOptions } from '../../client-options/order.grpc-client';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [ClientsModule.register([orderGrpcOptions])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
