import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ 
    description: 'Invoice status', 
    enum: InvoiceStatus,
    example: InvoiceStatus.PAID 
  })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;
}
