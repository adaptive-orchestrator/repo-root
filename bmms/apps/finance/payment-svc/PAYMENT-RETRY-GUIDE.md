# Payment Retry Mechanism - Implementation Guide

## Overview

The Payment Retry Mechanism automatically retries failed subscription payments using an exponential backoff strategy. This ensures maximum recovery of failed payments while avoiding overwhelming the payment gateway or customer.

## Components

### 1. **PaymentRetryService** (`payment-retry.service.ts`)
- Core logic for calculating retry delays and schedules
- Exponential backoff strategy implementation
- Failure analysis (temporary vs permanent)
- Customer messaging generation

### 2. **PaymentRetry Entity** (`payment-retry.entity.ts`)
- Database entity tracking retry attempts
- Stores retry history and metadata
- Indexed for efficient querying

### 3. **PaymentRetryManager** (`payment-retry.manager.ts`)
- Database operations for retry records
- Schedule, record, and manage retries
- Statistics and cleanup operations

### 4. **PaymentRetryProcessor** (`payment-retry.processor.ts`)
- Scheduled task processor
- Executes due retries every hour
- Daily cleanup and statistics

## Retry Strategy

### Exponential Backoff Schedule

| Attempt | Delay After Previous | Cumulative Time |
|---------|---------------------|-----------------|
| 1       | 1 hour              | 1 hour          |
| 2       | 2 hours             | 3 hours         |
| 3       | 4 hours             | 7 hours         |
| 4       | 8 hours             | 15 hours        |
| 5       | 1 day               | ~1.6 days       |
| 6       | 2 days              | ~3.6 days       |
| 7       | 3 days              | ~6.6 days       |

**Total Retry Window:** ~6.6 days
**Grace Period:** 15 days (subscription remains active)

### Configuration

Default configuration (can be customized):

```typescript
{
  maxAttempts: 7,
  initialDelayMs: 60 * 60 * 1000, // 1 hour
  maxDelayMs: 3 * 24 * 60 * 60 * 1000, // 3 days
  backoffMultiplier: 2,
  gracePeriodDays: 15,
}
```

## Failure Types

### Temporary Failures (Retryable)
- Insufficient funds
- Temporary gateway errors
- Network timeouts
- Processing errors

### Permanent Failures (Not Retryable)
- Card expired
- Invalid card
- Card declined
- Invalid account

## Usage

### 1. Schedule a Retry

When a payment fails, schedule a retry:

```typescript
await paymentRetryManager.scheduleRetry(
  paymentId,
  invoiceId,
  subscriptionId,
  'Insufficient funds'
);
```

### 2. Check Retry Status

Get current retry status:

```typescript
const status = await paymentRetryManager.getRetryStatus(paymentId);

console.log(status);
// {
//   subscriptionId: 123,
//   invoiceId: 456,
//   attempt: 2,
//   maxAttempts: 7,
//   nextRetryAt: Date,
//   lastRetryAt: Date,
//   failureReason: 'Insufficient funds',
//   canRetry: true,
//   isInGracePeriod: true,
//   daysUntilExpiration: 13
// }
```

### 3. Generate Customer Message

Create customer-friendly notifications:

```typescript
const status = await paymentRetryManager.getRetryStatus(paymentId);
const message = paymentRetryService.generateCustomerMessage(status);

// "Your payment failed: Insufficient funds. We'll automatically 
//  retry on 1/20/2025 at 3:00 PM. Attempt 2 of 7. Your service 
//  will continue for 13 more days while we attempt to process payment."
```

### 4. Cancel a Retry

Cancel scheduled retries (e.g., when customer updates payment method):

```typescript
await paymentRetryManager.cancelRetry(paymentId);
```

### 5. Get Subscription Retries

View all retry attempts for a subscription:

```typescript
const retries = await paymentRetryManager.getSubscriptionRetries(subscriptionId);
```

## Integration with Scheduler

Add to your scheduler service (e.g., `rl-scheduler`):

```typescript
import { PaymentRetryProcessor } from '@app/payment/retry';

@Cron(CronExpression.EVERY_HOUR)
async processPaymentRetries() {
  await this.paymentRetryProcessor.processRetries();
}

@Cron('0 3 * * *')
async cleanupOldRetries() {
  await this.paymentRetryProcessor.cleanupOldRetries();
}

@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async logRetryStatistics() {
  await this.paymentRetryProcessor.logStatistics();
}
```

## Event Flow

### On Payment Failure

```
1. Payment fails
2. PaymentService emits 'payment.failed' event
3. Subscription service listens and:
   - Updates subscription status to 'past_due'
   - Calls paymentRetryManager.scheduleRetry()
4. PaymentRetryManager creates retry record
5. Retry scheduled for next attempt time
```

### On Retry Attempt

```
1. Scheduler calls processRetries() every hour
2. PaymentRetryProcessor finds due retries
3. For each retry:
   - Mark as 'retrying'
   - Attempt payment
   - Record result
4. On success:
   - Mark retry as 'succeeded'
   - Update subscription status to 'active'
5. On failure:
   - Schedule next retry (if attempts remaining)
   - OR mark as 'exhausted' (if max attempts reached)
```

### On Retry Exhausted

```
1. All retry attempts failed
2. PaymentRetryProcessor emits 'payment.retry.exhausted'
3. Subscription service listens and:
   - Updates subscription status to 'expired'
   - Sends final notification to customer
   - Revokes access to service
```

## Database Schema

### payment_retries Table

```sql
CREATE TABLE payment_retries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  paymentId INT NOT NULL,
  invoiceId BIGINT NOT NULL,
  subscriptionId BIGINT NOT NULL,
  attemptNumber INT DEFAULT 0,
  maxAttempts INT DEFAULT 7,
  status ENUM('pending', 'retrying', 'succeeded', 'exhausted', 'cancelled') DEFAULT 'pending',
  firstFailureAt DATETIME NOT NULL,
  lastRetryAt DATETIME NULL,
  nextRetryAt DATETIME NULL,
  succeededAt DATETIME NULL,
  failureReason TEXT NOT NULL,
  lastError TEXT NULL,
  retryHistory JSON NULL,
  metadata JSON NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_invoice (paymentId, invoiceId),
  INDEX idx_next_retry (nextRetryAt),
  INDEX idx_status (status)
);
```

## Statistics & Monitoring

### Get Statistics

```typescript
const stats = await paymentRetryManager.getStatistics();
// {
//   total: 100,
//   pending: 15,
//   retrying: 2,
//   succeeded: 70,
//   exhausted: 10,
//   cancelled: 3,
//   successRate: '70.00%'
// }
```

### Log Entries

The service logs all retry activities:

```
🔄 Starting payment retry processing...
📋 Processing 5 due retries...
🔄 Processing retry for subscription 123, invoice 456 (attempt 2/7)
✅ Payment retry succeeded for subscription 123
❌ Payment retry failed for subscription 124: Insufficient funds
⚠️ Payment retry failed for subscription 124 (attempt 2/7) - Next retry: 2025-01-20T15:00:00Z
❌ Payment retries exhausted for subscription 125 after 7 attempts
✅ Retry processing complete in 1234ms - Succeeded: 2, Failed: 2, Exhausted: 1
```

## Customer Communication

### Email Templates

**Attempt 1-3 (Early Failures)**
```
Subject: Payment Failed - Will Retry Automatically

Hi [Customer],

We couldn't process your payment for [Subscription Plan].

Reason: Insufficient funds

Don't worry - we'll automatically try again in [Delay]. 
This is attempt [X] of 7. Your service will remain active 
while we attempt to process payment.

If you'd like to update your payment method, click here: [Link]
```

**Attempt 4-6 (Mid-Stage)**
```
Subject: Important: Multiple Payment Failures

Hi [Customer],

We've tried to process your payment [X] times without success.

We'll keep trying, but please update your payment method to 
avoid service interruption. We have [Days] days remaining 
before your subscription expires.

Update payment method: [Link]
```

**Attempt 7 (Final)**
```
Subject: Urgent: Final Payment Retry Attempt

Hi [Customer],

This is our final attempt to process your payment. If this 
fails, your subscription will expire in [Days] days.

Please update your payment method immediately: [Link]
```

**Exhausted**
```
Subject: Subscription Expired - Action Required

Hi [Customer],

Your subscription has expired due to multiple failed payment attempts.

To restore your service, please update your payment method: [Link]

All your data is safe and will be retained for 30 days.
```

## Testing

### Unit Tests

```typescript
describe('PaymentRetryService', () => {
  it('should calculate correct retry delays', () => {
    const service = new PaymentRetryService();
    expect(service.calculateRetryDelay(1)).toBe(3600000); // 1 hour
    expect(service.calculateRetryDelay(2)).toBe(7200000); // 2 hours
    expect(service.calculateRetryDelay(3)).toBe(14400000); // 4 hours
  });

  it('should generate correct retry schedule', () => {
    const service = new PaymentRetryService();
    const schedule = service.getRetrySchedule(new Date('2025-01-01T00:00:00Z'));
    expect(schedule).toHaveLength(7);
  });

  it('should identify retryable failures', () => {
    const service = new PaymentRetryService();
    const result = service.analyzeFailure('Insufficient funds');
    expect(result.retryable).toBe(true);
  });

  it('should identify non-retryable failures', () => {
    const service = new PaymentRetryService();
    const result = service.analyzeFailure('Card expired');
    expect(result.retryable).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('PaymentRetryManager', () => {
  it('should schedule retry successfully', async () => {
    const retry = await manager.scheduleRetry(1, 100, 200, 'Test failure');
    expect(retry.status).toBe('pending');
    expect(retry.attemptNumber).toBe(0);
    expect(retry.nextRetryAt).toBeDefined();
  });

  it('should record successful attempt', async () => {
    const retry = await manager.scheduleRetry(1, 100, 200, 'Test');
    const updated = await manager.recordAttempt(retry.id, true);
    expect(updated.status).toBe('succeeded');
    expect(updated.succeededAt).toBeDefined();
  });

  it('should schedule next retry on failure', async () => {
    const retry = await manager.scheduleRetry(1, 100, 200, 'Test');
    const updated = await manager.recordAttempt(retry.id, false, 'Error');
    expect(updated.status).toBe('pending');
    expect(updated.attemptNumber).toBe(1);
    expect(updated.nextRetryAt).toBeDefined();
  });
});
```

## Best Practices

1. **Always analyze failure type** before scheduling retry
2. **Notify customers** after 2-3 failed attempts
3. **Provide easy payment update** mechanism
4. **Log all retry attempts** for audit trail
5. **Monitor retry success rates** to optimize strategy
6. **Clean up old records** regularly
7. **Handle timezone correctly** for retry scheduling
8. **Test with various failure scenarios**

## Troubleshooting

### Retries Not Processing

- Check scheduler is running
- Verify `nextRetryAt` is in the past
- Ensure status is 'pending'
- Check payment service is available

### Too Many Retries Failing

- Analyze failure reasons
- Adjust backoff strategy
- Improve payment method validation
- Enhance customer notifications

### Performance Issues

- Add database indexes
- Batch process retries
- Implement connection pooling
- Monitor query performance

## Future Enhancements

1. **Smart retry timing** based on historical success rates
2. **A/B testing** different retry strategies
3. **Webhook notifications** for external systems
4. **Dashboard** for retry monitoring
5. **ML-based failure prediction**
6. **Multiple payment methods** fallback
7. **Partial payment** support
8. **Regional retry strategies**

## Summary

The Payment Retry Mechanism provides:
- ✅ Automatic recovery from temporary payment failures
- ✅ Customer-friendly grace period
- ✅ Intelligent exponential backoff
- ✅ Comprehensive logging and monitoring
- ✅ Easy integration with existing services
- ✅ Flexible configuration
- ✅ Production-ready implementation

Total implementation: **4 files, ~700 lines of code**

---

**Created:** January 2025
**Status:** Ready for integration
**Dependencies:** TypeORM, NestJS, Payment Service
