import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ValidatePromotionDto {
  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Promotion code to validate',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 1,
    description: 'Customer ID',
  })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    example: 1,
    description: 'Plan ID to apply promotion to',
  })
  @IsNumber()
  planId: number;

  @ApiPropertyOptional({
    example: 299.99,
    description: 'Purchase amount for validation',
  })
  @IsOptional()
  @IsNumber()
  purchaseAmount?: number;
}

export class ApplyPromotionDto extends ValidatePromotionDto {
  @ApiPropertyOptional({
    example: 123,
    description: 'Subscription ID (if applying to existing subscription)',
  })
  @IsOptional()
  @IsNumber()
  subscriptionId?: number;
}
