import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionSvcController } from './promotion-svc.controller';
import { PromotionSvcService } from './promotion-svc.service';
import { Promotion } from './entities/promotion.entity';
import { PromotionUsage } from './entities/promotion-usage.entity';
import { DbModule } from '@bmms/db';
import { EventModule } from '@bmms/event';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule.forRoot({ prefix: 'PROMOTION_SVC' }),
    TypeOrmModule.forFeature([Promotion, PromotionUsage]),
    EventModule,
  ],
  controllers: [PromotionSvcController],
  providers: [PromotionSvcService],
  exports: [PromotionSvcService],
})
export class PromotionSvcModule {}
