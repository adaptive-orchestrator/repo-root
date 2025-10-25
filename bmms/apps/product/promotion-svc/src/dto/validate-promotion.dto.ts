import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ValidatePromotionDto {
  @IsString()
  code: string;

  @IsNumber()
  customerId: number;

  @IsNumber()
  planId: number;

  @IsOptional()
  @IsNumber()
  purchaseAmount?: number;
}

export class ApplyPromotionDto extends ValidatePromotionDto {
  @IsOptional()
  @IsNumber()
  subscriptionId?: number;
}

export class PromotionValidationResult {
  valid: boolean;
  promotion?: any;
  error?: string;
  calculatedDiscount?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    trialExtensionDays?: number;
    freeMonths?: number;
  };
}
