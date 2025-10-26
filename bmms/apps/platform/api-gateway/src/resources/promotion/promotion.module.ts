import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { promotionGrpcOptions } from '../../client-options/promotion.grpc-client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROMOTION_PACKAGE',
        ...promotionGrpcOptions,
      },
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
