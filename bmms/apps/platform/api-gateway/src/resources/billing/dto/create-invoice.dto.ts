import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ description: 'Customer ID', example: 100 })
  @IsNumber()
  customerId: number;

  @ApiProperty({ description: 'Total amount', example: 500000 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ description: 'Tax amount', example: 50000, required: false })
  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @ApiProperty({ description: 'Discount amount', example: 0, required: false })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: 'Description', example: 'Order #1 - Invoice', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
