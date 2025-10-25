import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  customerId: number;

  @ApiProperty({ example: 2 })
  planId: number;

  @ApiProperty({ example: 'Premium Plan' })
  planName: string;

  @ApiProperty({ example: 299000 })
  amount: number;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  billingCycle: string;

  @ApiProperty({ example: 'active', enum: ['trial', 'active', 'past_due', 'cancelled', 'expired'] })
  status: string;

  @ApiProperty({ example: '2025-10-26T00:00:00.000Z' })
  currentPeriodStart: string;

  @ApiProperty({ example: '2025-11-26T00:00:00.000Z' })
  currentPeriodEnd: string;

  @ApiProperty({ example: false })
  isTrialUsed: boolean;

  @ApiProperty({ example: '2025-10-26T00:00:00.000Z', required: false })
  trialStart?: string;

  @ApiProperty({ example: '2025-11-09T00:00:00.000Z', required: false })
  trialEnd?: string;

  @ApiProperty({ example: false })
  cancelAtPeriodEnd: boolean;

  @ApiProperty({ example: null, required: false })
  cancelledAt?: string;

  @ApiProperty({ example: null, required: false })
  cancellationReason?: string;

  @ApiProperty({ example: '2025-10-26T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-26T00:00:00.000Z' })
  updatedAt: string;
}
