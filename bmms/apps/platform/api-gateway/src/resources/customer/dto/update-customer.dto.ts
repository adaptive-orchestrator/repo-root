import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum CustomerSegment {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export enum LifecycleStage {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  LOYAL = 'loyal',
  CHURNED = 'churned',
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Customer email',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '+84901234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main St, Hanoi, Vietnam',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Customer segment based on value',
    enum: CustomerSegment,
    example: CustomerSegment.GOLD,
  })
  @IsOptional()
  @IsEnum(CustomerSegment)
  segment?: CustomerSegment;

  @ApiPropertyOptional({
    description: 'Customer account status',
    enum: CustomerStatus,
    example: CustomerStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @ApiPropertyOptional({
    description: 'Customer lifecycle stage',
    enum: LifecycleStage,
    example: LifecycleStage.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(LifecycleStage)
  lifecycleStage?: LifecycleStage;

  @ApiPropertyOptional({
    description: 'Tenant ID for multi-tenancy',
    example: 'tenant-123',
  })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Total amount spent by customer',
    example: 1299.99,
  })
  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  @ApiPropertyOptional({
    description: 'Total number of orders placed',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  orderCount?: number;

  @ApiPropertyOptional({
    description: 'Notes about the customer',
    example: 'VIP customer, prefers email communication',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
