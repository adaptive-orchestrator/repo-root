import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
  Max,
  Length,
} from 'class-validator';

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  TRIAL_EXTENSION = 'trial_extension',
  FREE_MONTHS = 'free_months',
}

export enum PromotionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export enum ApplicableTo {
  ALL_PLANS = 'all_plans',
  SPECIFIC_PLANS = 'specific_plans',
  FIRST_TIME_ONLY = 'first_time_only',
}

export class CreatePromotionDto {
  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Unique promotion code (3-50 characters)',
  })
  @IsString()
  @Length(3, 50)
  code: string;

  @ApiProperty({
    example: 'Summer Sale 2024',
    description: 'Promotion name',
  })
  @IsString()
  @Length(3, 255)
  name: string;

  @ApiPropertyOptional({
    example: 'Get 20% off on all annual plans',
    description: 'Detailed description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: PromotionType,
    example: PromotionType.PERCENTAGE,
    description: 'Type of promotion',
  })
  @IsEnum(PromotionType)
  type: PromotionType;

  @ApiPropertyOptional({
    enum: PromotionStatus,
    example: PromotionStatus.ACTIVE,
    description: 'Promotion status',
  })
  @IsOptional()
  @IsEnum(PromotionStatus)
  status?: PromotionStatus;

  @ApiPropertyOptional({
    example: 20,
    description: 'Discount value (percentage 0-100 or fixed amount)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({
    example: 14,
    description: 'Number of days to extend trial period',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  trialExtensionDays?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Number of free months',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  freeMonths?: number;

  @ApiPropertyOptional({
    enum: ApplicableTo,
    example: ApplicableTo.ALL_PLANS,
    description: 'Which plans this promotion applies to',
  })
  @IsOptional()
  @IsEnum(ApplicableTo)
  applicableTo?: ApplicableTo;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Specific plan IDs if applicableTo is SPECIFIC_PLANS',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  specificPlanIds?: number[];

  @ApiPropertyOptional({
    example: 100,
    description: 'Maximum total uses (null = unlimited)',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUses?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Maximum uses per customer',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsesPerCustomer?: number;

  @ApiPropertyOptional({
    example: '2024-06-01T00:00:00Z',
    description: 'Promotion valid from date',
  })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({
    example: '2024-08-31T23:59:59Z',
    description: 'Promotion valid until date',
  })
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Minimum purchase amount to apply promotion',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Only for first-time customers',
  })
  @IsOptional()
  @IsBoolean()
  isFirstTimeOnly?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Apply to recurring renewals or just first payment',
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
