import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Plan ID',
    example: 2,
  })
  @IsNumber()
  planId: number;

  @ApiProperty({
    description: 'Promotion code (optional)',
    example: 'SAVE20',
    required: false,
  })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiProperty({
    description: 'Use trial period if available',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  useTrial?: boolean;
}
