import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { ChangePlanDto } from './dto/change-plan.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
// @ApiBearerAuth('accessToken')  // Uncomment when auth is ready
// @UseGuards(JwtAuthGuard)  // Uncomment when auth is ready
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create new subscription',
    description: 'Create a new subscription for a customer with a specific plan. Optionally enable trial period if plan supports it.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Subscription created successfully', 
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data or customer already has active subscription' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Customer or Plan not found' 
  })
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get subscription by ID',
    description: 'Retrieve detailed information about a specific subscription'
  })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription found', 
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Subscription not found' 
  })
  async getSubscriptionById(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.getSubscriptionById(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ 
    summary: 'Get all subscriptions for a customer',
    description: 'Retrieve all subscriptions (active, cancelled, expired) for a specific customer'
  })
  @ApiParam({ name: 'customerId', description: 'Customer ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Customer subscriptions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        subscriptions: {
          type: 'array',
          items: { $ref: '#/components/schemas/SubscriptionResponseDto' }
        }
      }
    }
  })
  async getSubscriptionsByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.subscriptionService.getSubscriptionsByCustomer(customerId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ 
    summary: 'Cancel subscription',
    description: 'Cancel a subscription. Can be immediate or scheduled for end of billing period.'
  })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription cancelled successfully', 
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Subscription already cancelled' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Subscription not found' 
  })
  async cancelSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelSubscriptionDto,
  ) {
    return this.subscriptionService.cancelSubscription(id, dto);
  }

  @Patch(':id/renew')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Renew subscription',
    description: 'Manually renew a subscription. This is typically handled automatically by scheduler.'
  })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription renewed successfully', 
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Subscription cannot be renewed (e.g., already cancelled)' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Subscription not found' 
  })
  async renewSubscription(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionService.renewSubscription(id);
  }

  @Patch(':id/change-plan')
  @ApiOperation({ 
    summary: 'Change subscription plan',
    description: 'Upgrade or downgrade subscription plan. Can be immediate or scheduled for end of current billing period.'
  })
  @ApiParam({ name: 'id', description: 'Subscription ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Plan changed successfully', 
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Can only change plan for active subscriptions' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Subscription or new plan not found' 
  })
  async changePlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePlanDto,
  ) {
    return this.subscriptionService.changePlan(id, dto);
  }
}
