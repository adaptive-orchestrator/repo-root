import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreatePlanDto {
  @ApiProperty({ 
    description: 'Plan name', 
    example: 'Business Plan' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Plan description', 
    example: 'Perfect for growing businesses' 
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Plan price (monthly or yearly based on billing cycle)', 
    example: 199.99 
  })
  @IsNumber()
  price: number;

  @ApiProperty({ 
    description: 'Billing cycle', 
    enum: BillingCycle,
    example: BillingCycle.MONTHLY 
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ 
    description: 'Array of feature IDs to include in this plan', 
    example: [1, 2, 3],
    required: false,
    type: [Number]
  })
  @IsArray()
  @IsOptional()
  features?: number[];

  @ApiProperty({ 
    description: 'Enable trial period for this plan', 
    example: true,
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  trialEnabled?: boolean;

  @ApiProperty({ 
    description: 'Trial period duration in days (only if trialEnabled is true)', 
    example: 14, 
    required: false 
  })
  @IsNumber()
  @IsOptional()
  trialDays?: number;
}
