import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromotionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'SUMMER2024' })
  code: string;

  @ApiProperty({ example: 'Summer Sale 2024' })
  name: string;

  @ApiPropertyOptional({ example: 'Get 20% off on all annual plans' })
  description?: string;

  @ApiProperty({ example: 'percentage' })
  type: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiPropertyOptional({ example: 20 })
  discountValue?: number;

  @ApiPropertyOptional({ example: 14 })
  trialExtensionDays?: number;

  @ApiPropertyOptional({ example: 2 })
  freeMonths?: number;

  @ApiProperty({ example: 'all_plans' })
  applicableTo: string;

  @ApiPropertyOptional({ example: [1, 2, 3], type: [Number] })
  specificPlanIds?: number[];

  @ApiPropertyOptional({ example: 100 })
  maxUses?: number;

  @ApiProperty({ example: 25 })
  currentUses: number;

  @ApiPropertyOptional({ example: 1 })
  maxUsesPerCustomer?: number;

  @ApiPropertyOptional({ example: '2024-06-01T00:00:00Z' })
  validFrom?: string;

  @ApiPropertyOptional({ example: '2024-08-31T23:59:59Z' })
  validUntil?: string;

  @ApiPropertyOptional({ example: 100 })
  minPurchaseAmount?: number;

  @ApiProperty({ example: false })
  isFirstTimeOnly: boolean;

  @ApiProperty({ example: false })
  isRecurring: boolean;

  @ApiProperty({ example: '2024-05-01T10:30:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-05-15T14:20:00Z' })
  updatedAt: string;
}

export class CalculatedDiscountDto {
  @ApiProperty({ example: 299.99 })
  originalAmount: number;

  @ApiProperty({ example: 60 })
  discountAmount: number;

  @ApiProperty({ example: 239.99 })
  finalAmount: number;

  @ApiPropertyOptional({ example: 14 })
  trialExtensionDays?: number;

  @ApiPropertyOptional({ example: 2 })
  freeMonths?: number;
}

export class ValidationResponseDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiPropertyOptional({ example: 'Promotion is expired' })
  error?: string;

  @ApiPropertyOptional({ type: PromotionResponseDto })
  promotion?: PromotionResponseDto;

  @ApiPropertyOptional({ type: CalculatedDiscountDto })
  calculatedDiscount?: CalculatedDiscountDto;
}

export class ApplyPromotionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional({ example: 'Promotion applied successfully' })
  error?: string;

  @ApiPropertyOptional({ type: PromotionResponseDto })
  promotion?: PromotionResponseDto;

  @ApiPropertyOptional({ type: CalculatedDiscountDto })
  discount?: CalculatedDiscountDto;

  @ApiProperty({ example: 456 })
  usageId: number;
}

export class PromotionListResponseDto {
  @ApiProperty({ type: [PromotionResponseDto] })
  promotions: PromotionResponseDto[];

  @ApiProperty({ example: 25 })
  total: number;
}
