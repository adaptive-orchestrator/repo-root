import { IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  planId: number;

  @IsOptional()
  @IsString()
  promotionCode?: string;

  @IsOptional()
  @IsBoolean()
  useTrial?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
