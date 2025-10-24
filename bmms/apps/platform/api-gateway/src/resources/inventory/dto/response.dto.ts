import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty({
    description: 'Inventory ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Total quantity',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Reserved quantity',
    example: 10,
  })
  reserved: number;

  @ApiProperty({
    description: 'Available quantity (quantity - reserved)',
    example: 90,
  })
  available: number;

  @ApiPropertyOptional({
    description: 'Warehouse location',
    example: 'Warehouse A',
  })
  warehouseLocation?: string;

  @ApiProperty({
    description: 'Reorder level threshold',
    example: 20,
  })
  reorderLevel: number;

  @ApiProperty({
    description: 'Maximum stock capacity',
    example: 500,
  })
  maxStock: number;

  @ApiProperty({
    description: 'Is inventory active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-10-25T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2025-10-25T12:00:00Z',
  })
  updatedAt: string;
}

export class CreateInventoryResponseDto {
  @ApiProperty({ type: InventoryResponseDto })
  inventory: InventoryResponseDto;

  @ApiProperty({
    description: 'Response message',
    example: 'Inventory created successfully',
  })
  message: string;
}

export class InventoryListResponseDto {
  @ApiProperty({
    type: [InventoryResponseDto],
    description: 'List of inventory items',
  })
  items: InventoryResponseDto[];

  @ApiProperty({
    description: 'Total count',
    example: 10,
  })
  total: number;
}

export class ReservationResponseDto {
  @ApiProperty({
    description: 'Reservation ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'Reserved quantity',
    example: 5,
  })
  reservedQuantity: number;

  @ApiProperty({
    description: 'Order ID',
    example: 123,
  })
  orderId: number;

  @ApiProperty({
    description: 'Customer ID',
    example: 456,
  })
  customerId: number;

  @ApiProperty({
    description: 'Reservation status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-10-25T12:00:00Z',
  })
  createdAt: string;
}

export class AvailabilityResponseDto {
  @ApiProperty({
    description: 'Is stock available',
    example: true,
  })
  available: boolean;

  @ApiProperty({
    description: 'Available quantity',
    example: 90,
  })
  availableQuantity: number;

  @ApiProperty({
    description: 'Availability message',
    example: 'Stock available',
  })
  message: string;
}

export class InventoryErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Insufficient stock',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}
