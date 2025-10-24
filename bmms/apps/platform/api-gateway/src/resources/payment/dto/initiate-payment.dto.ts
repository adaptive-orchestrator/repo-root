import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Invoice ID', example: 1 })
  @IsNumber()
  invoiceId: number;

  @ApiProperty({ description: 'Order ID', example: 100, required: false })
  @IsNumber()
  @IsOptional()
  orderId?: number;

  @ApiProperty({ description: 'Customer ID', example: 50, required: false })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({ description: 'Payment amount', example: 500000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Payment method', example: 'vnpay' })
  @IsString()
  method: string;
}
