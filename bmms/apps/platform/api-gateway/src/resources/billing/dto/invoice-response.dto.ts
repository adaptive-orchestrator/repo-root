import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty({ description: 'Invoice ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Order ID', example: 100 })
  orderId: number;

  @ApiProperty({ description: 'Customer ID', example: 50 })
  customerId: number;

  @ApiProperty({ description: 'Total amount', example: 500000 })
  totalAmount: number;

  @ApiProperty({ description: 'Tax amount', example: 50000 })
  taxAmount: number;

  @ApiProperty({ description: 'Discount amount', example: 0 })
  discountAmount: number;

  @ApiProperty({ description: 'Net amount (after discount)', example: 500000 })
  netAmount: number;

  @ApiProperty({ description: 'Invoice status', example: 'pending' })
  status: string;

  @ApiProperty({ description: 'Invoice number', example: 'INV-2025-0001' })
  invoiceNumber: string;

  @ApiProperty({ description: 'Description', example: 'Order #100 - Invoice' })
  description?: string;

  @ApiProperty({ description: 'Due date', example: '2025-11-01T00:00:00.000Z' })
  dueDate: Date;

  @ApiProperty({ description: 'Created at', example: '2025-10-25T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2025-10-25T00:00:00.000Z' })
  updatedAt: Date;
}
