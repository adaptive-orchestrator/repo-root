import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { subscriptionGrpcOptions } from '../../client-options/subscription.grpc-client';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [ClientsModule.register([subscriptionGrpcOptions])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
