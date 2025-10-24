import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Invoice ID', example: 1 })
  invoiceId: number;

  @ApiProperty({ description: 'Order ID', example: 100 })
  orderId?: number;

  @ApiProperty({ description: 'Customer ID', example: 50 })
  customerId?: number;

  @ApiProperty({ description: 'Total amount', example: 500000 })
  totalAmount: number;

  @ApiProperty({ description: 'Payment status', example: 'pending' })
  status: string;

  @ApiProperty({ description: 'Payment method', example: 'vnpay' })
  method: string;

  @ApiProperty({ description: 'Transaction ID', example: 'VNPAY-TXN-123' })
  transactionId?: string;

  @ApiProperty({ description: 'Failure reason', example: 'Insufficient balance' })
  failureReason?: string;

  @ApiProperty({ description: 'Payment date', example: '2025-10-25T00:00:00.000Z' })
  paidAt?: Date;

  @ApiProperty({ description: 'Created at', example: '2025-10-25T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2025-10-25T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaymentStatsDto {
  @ApiProperty({ description: 'Total payments count', example: 100 })
  totalPayments: number;

  @ApiProperty({ description: 'Successful payments count', example: 85 })
  successfulPayments: number;

  @ApiProperty({ description: 'Failed payments count', example: 10 })
  failedPayments: number;

  @ApiProperty({ description: 'Pending payments count', example: 5 })
  pendingPayments: number;

  @ApiProperty({ description: 'Total amount', example: 5000000 })
  totalAmount: number;

  @ApiProperty({ description: 'Successful amount', example: 4500000 })
  successfulAmount: number;
}
