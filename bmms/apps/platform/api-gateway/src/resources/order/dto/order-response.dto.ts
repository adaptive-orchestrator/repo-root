import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 99.99 })
  price: number;

  @ApiProperty({ example: 199.98 })
  subtotal: number;

  @ApiPropertyOptional({ example: 'Color: Red' })
  notes?: string;
}

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ORD-20241024-001' })
  orderNumber: string;

  @ApiProperty({ example: 1 })
  customerId: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 199.98 })
  subtotal: number;

  @ApiProperty({ example: 15.00 })
  tax: number;

  @ApiProperty({ example: 10.00 })
  shippingCost: number;

  @ApiProperty({ example: 5.00 })
  discount: number;

  @ApiProperty({ example: 219.98 })
  totalAmount: number;

  @ApiPropertyOptional({ example: 'Please deliver before 5pm' })
  notes?: string;

  @ApiProperty({ example: '123 Main St, City, State 12345' })
  shippingAddress: string;

  @ApiPropertyOptional({ example: '456 Billing Ave, City, State 12345' })
  billingAddress?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: '2024-10-24T12:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-10-24T12:00:00Z' })
  updatedAt: string;
}
