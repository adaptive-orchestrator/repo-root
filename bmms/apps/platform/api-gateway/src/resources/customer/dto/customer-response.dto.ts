import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, Hanoi, Vietnam' })
  address?: string;

  @ApiProperty({ example: 'bronze', enum: ['bronze', 'silver', 'gold', 'platinum'] })
  segment: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'blocked'] })
  status: string;

  @ApiProperty({ example: 'lead', enum: ['lead', 'prospect', 'customer', 'loyal', 'churned'] })
  lifecycleStage: string;

  @ApiPropertyOptional({ example: 'tenant-123' })
  tenantId?: string;

  @ApiPropertyOptional({ example: 123, description: 'User ID from Auth service' })
  userId?: number;

  @ApiProperty({ example: 1299.99 })
  totalSpent: number;

  @ApiProperty({ example: 15 })
  orderCount: number;

  @ApiPropertyOptional({ example: '2025-01-15T10:30:00Z' })
  lastOrderDate?: string;

  @ApiPropertyOptional({ example: 'VIP customer, prefers email communication' })
  notes?: string;

  @ApiProperty({ example: '2025-01-15T10:30:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-16T14:20:00Z' })
  updatedAt: string;
}

export class CustomersListResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  customers: CustomerResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
