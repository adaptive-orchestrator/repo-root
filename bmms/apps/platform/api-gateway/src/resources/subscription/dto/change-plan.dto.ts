import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class ChangePlanDto {
  @ApiProperty({
    description: 'New plan ID',
    example: 3,
  })
  @IsNumber()
  newPlanId: number;

  @ApiProperty({
    description: 'Apply change immediately (true) or at end of billing period (false)',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  immediate?: boolean;
}
