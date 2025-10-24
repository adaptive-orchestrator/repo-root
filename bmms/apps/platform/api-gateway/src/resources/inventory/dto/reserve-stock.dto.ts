import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class ReserveStockDto {
  @ApiProperty({
    description: 'Product ID to reserve',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Quantity to reserve',
    example: 5,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Order ID',
    example: 123,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({
    description: 'Customer ID',
    example: 456,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  customerId: number;
}
