import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CancelSubscriptionDto {
  @ApiProperty({
    description: 'Reason for cancellation',
    example: 'Too expensive',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Cancel at the end of current billing period',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  cancelAtPeriodEnd?: boolean;
}
