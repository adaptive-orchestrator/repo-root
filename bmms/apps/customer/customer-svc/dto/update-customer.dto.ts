import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CustomerSegment, CustomerStatus, LifecycleStage } from '../src/customer.entity';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(CustomerSegment)
  segment?: CustomerSegment;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  @IsOptional()
  @IsEnum(LifecycleStage)
  lifecycleStage?: LifecycleStage;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  @IsOptional()
  @IsNumber()
  orderCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
