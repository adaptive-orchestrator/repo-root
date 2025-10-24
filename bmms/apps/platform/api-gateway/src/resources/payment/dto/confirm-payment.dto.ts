import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class ConfirmPaymentDto {
  @ApiProperty({ description: 'Payment ID', example: 'PAY-123' })
  @IsString()
  paymentId: string;

  @ApiProperty({ 
    description: 'Payment status', 
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED 
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'Transaction ID from payment gateway', example: 'VNPAY-TXN-123', required: false })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ description: 'Failure reason if payment failed', required: false })
  @IsString()
  @IsOptional()
  failureReason?: string;
}
