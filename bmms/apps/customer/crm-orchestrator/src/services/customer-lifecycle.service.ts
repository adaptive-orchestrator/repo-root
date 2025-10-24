import { Injectable, Logger } from '@nestjs/common';

export enum LifecycleStage {
  LEAD = 'lead',           // Chưa mua hàng
  PROSPECT = 'prospect',   // Đang quan tâm (added to cart, viewed products)
  CUSTOMER = 'customer',   // Đã mua hàng
  LOYAL = 'loyal',         // Mua nhiều lần
  CHURNED = 'churned',     // Không hoạt động lâu
}

@Injectable()
export class CustomerLifecycleService {
  private readonly logger = new Logger(CustomerLifecycleService.name);

  /**
   * Calculate lifecycle stage based on customer activity
   */
  calculateLifecycleStage(orderCount: number, lastOrderDate: Date | null, totalSpent: number): LifecycleStage {
    this.logger.debug(`Calculating lifecycle: orders=${orderCount}, lastOrder=${lastOrderDate}, spent=$${totalSpent}`);

    // Check if churned (no order in 90 days)
    if (orderCount > 0 && lastOrderDate) {
      const daysSinceLastOrder = this.getDaysSince(lastOrderDate);
      if (daysSinceLastOrder > 90) {
        return LifecycleStage.CHURNED;
      }
    }

    // Determine stage based on order count
    if (orderCount === 0) {
      return LifecycleStage.LEAD;
    } else if (orderCount === 1 || orderCount === 2) {
      return LifecycleStage.CUSTOMER;
    } else if (orderCount >= 5 || totalSpent >= 5000) {
      return LifecycleStage.LOYAL;
    } else {
      return LifecycleStage.CUSTOMER;
    }
  }

  /**
   * Calculate days since a date
   */
  private getDaysSince(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if customer is at risk of churning
   */
  isAtRiskOfChurning(lastOrderDate: Date | null, orderCount: number): boolean {
    if (!lastOrderDate || orderCount === 0) return false;
    
    const daysSinceLastOrder = this.getDaysSince(lastOrderDate);
    
    // At risk if no order in 60-90 days
    return daysSinceLastOrder >= 60 && daysSinceLastOrder < 90;
  }

  /**
   * Get recommended actions based on lifecycle stage
   */
  getRecommendedActions(stage: LifecycleStage): string[] {
    const actions = {
      [LifecycleStage.LEAD]: [
        'Send welcome email',
        'Offer first-time discount',
        'Show popular products',
      ],
      [LifecycleStage.PROSPECT]: [
        'Send abandoned cart reminder',
        'Offer limited-time discount',
        'Show product reviews',
      ],
      [LifecycleStage.CUSTOMER]: [
        'Send thank you email',
        'Request product review',
        'Suggest complementary products',
      ],
      [LifecycleStage.LOYAL]: [
        'Upgrade to premium segment',
        'Invite to VIP program',
        'Send exclusive offers',
      ],
      [LifecycleStage.CHURNED]: [
        'Send win-back campaign',
        'Offer special discount',
        'Ask for feedback',
      ],
    };
    return actions[stage] || [];
  }

  /**
   * Calculate customer lifetime value (CLV) estimate
   */
  estimateLifetimeValue(totalSpent: number, orderCount: number, daysSinceFirstOrder: number): number {
    if (orderCount === 0 || daysSinceFirstOrder === 0) return 0;
    
    const avgOrderValue = totalSpent / orderCount;
    const avgDaysBetweenOrders = daysSinceFirstOrder / orderCount;
    const ordersPerYear = 365 / avgDaysBetweenOrders;
    const estimatedYearsAsCustomer = 3; // Average customer lifetime
    
    return avgOrderValue * ordersPerYear * estimatedYearsAsCustomer;
  }
}
