import { Injectable, Logger } from '@nestjs/common';

export enum CustomerSegment {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

@Injectable()
export class CustomerSegmentationService {
  private readonly logger = new Logger(CustomerSegmentationService.name);

  /**
   * Calculate customer segment based on total spent
   * Business rules:
   * - Bronze: $0 - $999
   * - Silver: $1,000 - $4,999
   * - Gold: $5,000 - $19,999
   * - Platinum: $20,000+
   */
  calculateSegment(totalSpent: number): CustomerSegment {
    this.logger.debug(`Calculating segment for totalSpent: $${totalSpent}`);
    
    if (totalSpent >= 20000) {
      return CustomerSegment.PLATINUM;
    } else if (totalSpent >= 5000) {
      return CustomerSegment.GOLD;
    } else if (totalSpent >= 1000) {
      return CustomerSegment.SILVER;
    } else {
      return CustomerSegment.BRONZE;
    }
  }

  /**
   * Check if segment should be upgraded based on purchase
   */
  shouldUpgradeSegment(currentSegment: string, newTotalSpent: number): boolean {
    const newSegment = this.calculateSegment(newTotalSpent);
    return this.getSegmentRank(newSegment) > this.getSegmentRank(currentSegment as CustomerSegment);
  }

  /**
   * Get numeric rank for segment comparison
   */
  private getSegmentRank(segment: CustomerSegment): number {
    const ranks = {
      [CustomerSegment.BRONZE]: 1,
      [CustomerSegment.SILVER]: 2,
      [CustomerSegment.GOLD]: 3,
      [CustomerSegment.PLATINUM]: 4,
    };
    return ranks[segment] || 0;
  }

  /**
   * Get segment benefits description
   */
  getSegmentBenefits(segment: CustomerSegment): string[] {
    const benefits = {
      [CustomerSegment.BRONZE]: [
        'Standard support',
        'Basic discounts',
      ],
      [CustomerSegment.SILVER]: [
        'Priority support',
        '5% discount on all orders',
        'Early access to new products',
      ],
      [CustomerSegment.GOLD]: [
        'Premium support 24/7',
        '10% discount on all orders',
        'Free shipping',
        'Exclusive promotions',
      ],
      [CustomerSegment.PLATINUM]: [
        'Dedicated account manager',
        '15% discount on all orders',
        'Free express shipping',
        'VIP events access',
        'Custom solutions',
      ],
    };
    return benefits[segment] || [];
  }
}
