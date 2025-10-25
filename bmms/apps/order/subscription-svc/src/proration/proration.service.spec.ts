import { Test, TestingModule } from '@nestjs/testing';
import { ProrationService } from './proration.service';

describe('ProrationService', () => {
  let service: ProrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProrationService],
    }).compile();

    service = module.get<ProrationService>(ProrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateProration', () => {
    it('should calculate proration for mid-cycle upgrade', () => {
      // Setup: $30/month plan, upgrade to $50/month on day 15 of 30
      const oldAmount = 30;
      const newAmount = 50;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-01-15');

      const result = service.calculateProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      // 16 days remaining (from Jan 15 to Jan 31)
      expect(result.remainingDays).toBe(16);
      expect(result.totalDaysInPeriod).toBe(30);
      
      // Old daily rate: $30 / 30 = $1.00
      expect(result.oldPlanDailyRate).toBe(1.00);
      
      // New daily rate: $50 / 30 = $1.67
      expect(result.newPlanDailyRate).toBeCloseTo(1.67, 2);
      
      // Credit: $1.00 * 16 = $16.00
      expect(result.creditAmount).toBe(16.00);
      
      // Charge: $1.67 * 16 = $26.72
      expect(result.chargeAmount).toBeCloseTo(26.67, 0);
      
      // Net: $26.67 - $16.00 = $10.67
      expect(result.netAmount).toBeGreaterThan(0); // Customer owes money
      expect(result.netAmount).toBeCloseTo(10.67, 0);
    });

    it('should calculate proration for mid-cycle downgrade', () => {
      // Setup: $50/month plan, downgrade to $30/month on day 15
      const oldAmount = 50;
      const newAmount = 30;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-01-15');

      const result = service.calculateProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      // Net amount should be negative (customer gets credit)
      expect(result.netAmount).toBeLessThan(0);
      expect(result.netAmount).toBeCloseTo(-10.67, 0);
    });

    it('should handle early month change (more days remaining)', () => {
      // Change on day 5, 26 days remaining
      const oldAmount = 99;
      const newAmount = 49;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-01-05');

      const result = service.calculateProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      expect(result.remainingDays).toBe(26);
      
      // Old daily rate: $99 / 30 = $3.30
      expect(result.oldPlanDailyRate).toBeCloseTo(3.30, 2);
      
      // Credit: $3.30 * 26 = $85.80
      expect(result.creditAmount).toBeCloseTo(85.80, 0);
      
      // Large credit for downgrade
      expect(result.netAmount).toBeLessThan(0);
    });

    it('should handle yearly plan proration', () => {
      // Yearly plan: $365/year, change mid-year
      const oldAmount = 365;
      const newAmount = 730; // Double price
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-12-31');
      const changeDate = new Date('2025-07-01'); // Mid-year

      const result = service.calculateProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'yearly'
      );

      expect(result.totalDaysInPeriod).toBe(364);
      expect(result.remainingDays).toBeGreaterThan(180); // More than 6 months
      
      // Net should be positive (upgrade)
      expect(result.netAmount).toBeGreaterThan(0);
    });

    it('should throw error if change date is outside period', () => {
      const oldAmount = 30;
      const newAmount = 50;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-02-15'); // Outside period

      expect(() => {
        service.calculateProration(
          oldAmount,
          newAmount,
          periodStart,
          periodEnd,
          changeDate,
          'monthly'
        );
      }).toThrow('Change date must be within current billing period');
    });
  });

  describe('calculateImmediateChangeProration', () => {
    it('should calculate immediate upgrade with new period', () => {
      const oldAmount = 30;
      const newAmount = 50;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-01-15');

      const result = service.calculateImmediateChangeProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      // Credit for unused days
      expect(result.creditAmount).toBe(16.00);
      
      // Charge FULL amount of new plan
      expect(result.chargeAmount).toBe(50.00);
      
      // Net: $50.00 - $16.00 = $34.00
      expect(result.netAmount).toBeCloseTo(34.00, 2);
      
      // New billing period starts today
      expect(result.effectiveDate).toEqual(changeDate);
      expect(result.nextBillingDate.getTime()).toBeGreaterThan(changeDate.getTime());
    });

    it('should calculate immediate downgrade with credit', () => {
      const oldAmount = 99;
      const newAmount = 29;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const changeDate = new Date('2025-01-10');

      const result = service.calculateImmediateChangeProration(
        oldAmount,
        newAmount,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      // 21 days remaining
      expect(result.remainingDays).toBe(21);
      
      // Large credit from old plan
      const expectedCredit = (99 / 30) * 21;
      expect(result.creditAmount).toBeCloseTo(expectedCredit, 0);
      
      // Charge new plan full price
      expect(result.chargeAmount).toBe(29.00);
      
      // Net might still be positive or negative depending on credit
      expect(result.netAmount).toBeDefined();
    });

    it('should set correct next billing date for monthly', () => {
      const changeDate = new Date('2025-01-15');
      const result = service.calculateImmediateChangeProration(
        30, 50,
        new Date('2025-01-01'),
        new Date('2025-01-31'),
        changeDate,
        'monthly'
      );

      // Next billing should be exactly 1 month from change date
      const expectedNextBilling = new Date('2025-02-15');
      expect(result.nextBillingDate.toDateString()).toBe(expectedNextBilling.toDateString());
    });

    it('should set correct next billing date for yearly', () => {
      const changeDate = new Date('2025-01-15');
      const result = service.calculateImmediateChangeProration(
        300, 500,
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        changeDate,
        'yearly'
      );

      // Next billing should be exactly 1 year from change date
      const expectedNextBilling = new Date('2026-01-15');
      expect(result.nextBillingDate.toDateString()).toBe(expectedNextBilling.toDateString());
    });
  });

  describe('getChangeType', () => {
    it('should identify upgrade', () => {
      expect(service.getChangeType(30, 50)).toBe('upgrade');
    });

    it('should identify downgrade', () => {
      expect(service.getChangeType(50, 30)).toBe('downgrade');
    });

    it('should identify sidegrade', () => {
      expect(service.getChangeType(30, 30)).toBe('sidegrade');
    });
  });

  describe('generateProrationDescription', () => {
    it('should generate upgrade description', () => {
      const proration = {
        creditAmount: 16.00,
        creditDays: 16,
        chargeAmount: 26.67,
        chargeDays: 16,
        netAmount: 10.67,
        oldPlanDailyRate: 1.00,
        newPlanDailyRate: 1.67,
        remainingDays: 16,
        totalDaysInPeriod: 30,
        effectiveDate: new Date(),
        nextBillingDate: new Date(),
      };

      const description = service.generateProrationDescription(proration, 'upgrade');

      expect(description).toContain('Credit for unused 16 days');
      expect(description).toContain('$16.00');
      expect(description).toContain('Charge for 16 days');
      expect(description).toContain('$26.67');
      expect(description).toContain('Total due today: $10.67');
    });

    it('should generate downgrade description with credit', () => {
      const proration = {
        creditAmount: 26.67,
        creditDays: 16,
        chargeAmount: 16.00,
        chargeDays: 16,
        netAmount: -10.67,
        oldPlanDailyRate: 1.67,
        newPlanDailyRate: 1.00,
        remainingDays: 16,
        totalDaysInPeriod: 30,
        effectiveDate: new Date(),
        nextBillingDate: new Date(),
      };

      const description = service.generateProrationDescription(proration, 'downgrade');

      expect(description).toContain('Credit applied: $10.67');
    });
  });

  describe('shouldApplyProration', () => {
    it('should apply proration for amounts >= $1.00', () => {
      expect(service.shouldApplyProration(1.00)).toBe(true);
      expect(service.shouldApplyProration(5.50)).toBe(true);
      expect(service.shouldApplyProration(-1.50)).toBe(true); // Absolute value
    });

    it('should skip proration for amounts < $1.00', () => {
      expect(service.shouldApplyProration(0.99)).toBe(false);
      expect(service.shouldApplyProration(0.50)).toBe(false);
      expect(service.shouldApplyProration(0.01)).toBe(false);
    });

    it('should respect custom threshold', () => {
      expect(service.shouldApplyProration(4.99, 5.00)).toBe(false);
      expect(service.shouldApplyProration(5.00, 5.00)).toBe(true);
      expect(service.shouldApplyProration(5.01, 5.00)).toBe(true);
    });
  });

  describe('calculateCancellationRefund', () => {
    it('should calculate refund for mid-period cancellation', () => {
      const amount = 30;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const cancellationDate = new Date('2025-01-15');

      const result = service.calculateCancellationRefund(
        amount,
        periodStart,
        periodEnd,
        cancellationDate
      );

      expect(result.totalDays).toBe(30);
      expect(result.refundDays).toBe(16); // 16 days remaining
      expect(result.dailyRate).toBe(1.00);
      expect(result.refundAmount).toBe(16.00);
    });

    it('should calculate refund for early cancellation', () => {
      const amount = 99;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const cancellationDate = new Date('2025-01-05');

      const result = service.calculateCancellationRefund(
        amount,
        periodStart,
        periodEnd,
        cancellationDate
      );

      expect(result.refundDays).toBe(26); // Most of month unused
      
      const expectedRefund = (99 / 30) * 26;
      expect(result.refundAmount).toBeCloseTo(expectedRefund, 2);
    });

    it('should return zero refund for end-of-period cancellation', () => {
      const amount = 30;
      const periodStart = new Date('2025-01-01');
      const periodEnd = new Date('2025-01-31');
      const cancellationDate = new Date('2025-01-31');

      const result = service.calculateCancellationRefund(
        amount,
        periodStart,
        periodEnd,
        cancellationDate
      );

      expect(result.refundDays).toBe(0);
      expect(result.refundAmount).toBe(0);
    });
  });

  describe('getProrationPolicy', () => {
    it('should return policy description', () => {
      const policy = service.getProrationPolicy();
      
      expect(policy).toContain('Plan upgrades');
      expect(policy).toContain('Plan downgrades');
      expect(policy).toContain('prorated');
      expect(policy).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle same-day period (edge case)', () => {
      const periodStart = new Date('2025-01-15');
      const periodEnd = new Date('2025-01-15');
      const changeDate = new Date('2025-01-15');

      const result = service.calculateProration(
        30, 50,
        periodStart,
        periodEnd,
        changeDate,
        'monthly'
      );

      expect(result.remainingDays).toBe(0);
      expect(result.creditAmount).toBe(0);
      expect(result.chargeAmount).toBe(0);
      expect(result.netAmount).toBe(0);
    });

    it('should handle large price differences', () => {
      // Free plan to expensive plan
      const result = service.calculateProration(
        0, 999,
        new Date('2025-01-01'),
        new Date('2025-01-31'),
        new Date('2025-01-15'),
        'monthly'
      );

      expect(result.creditAmount).toBe(0);
      expect(result.chargeAmount).toBeGreaterThan(0);
      expect(result.netAmount).toBeGreaterThan(0);
    });

    it('should round to 2 decimal places', () => {
      // Prices that would create many decimal places
      const result = service.calculateProration(
        33.33, 66.67,
        new Date('2025-01-01'),
        new Date('2025-01-31'),
        new Date('2025-01-15'),
        'monthly'
      );

      // Check all amounts are rounded to 2 decimals
      expect(result.creditAmount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.chargeAmount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.netAmount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
