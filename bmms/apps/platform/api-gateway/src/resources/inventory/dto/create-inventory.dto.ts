import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Product ID from catalogue',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Initial quantity',
    example: 100,
    type: Number,
    default: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Warehouse location',
    example: 'Warehouse A',
    type: String,
  })
  @IsOptional()
  @IsString()
  warehouseLocation?: string;

  @ApiPropertyOptional({
    description: 'Reorder level threshold',
    example: 20,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  reorderLevel?: number;

  @ApiPropertyOptional({
    description: 'Maximum stock capacity',
    example: 500,
    type: Number,
    default: 1000,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxStock?: number;
}
