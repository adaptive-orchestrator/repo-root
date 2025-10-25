# E2E Testing Guide - Subscription Flow

## Prerequisites

### 1. Start All Services

```bash
# Start databases with Docker Compose
docker-compose up -d customer_db catalogue_db subscription_db billing_db promotion_db

# Wait for databases to be healthy
docker-compose ps

# Start Kafka
docker-compose up -d zookeeper kafka
```

### 2. Run Database Migrations

```bash
# From bmms/migrations directory
mysql -u root -p < run_all_migrations.sql
```

### 3. Seed Test Data

```sql
-- Connect to MySQL
mysql -u root -p

-- Create test customer
USE customer_db;
INSERT INTO customers (id, email, name, phone) 
VALUES (1, 'test@example.com', 'Test Customer', '0123456789');

-- Create test plans
USE catalogue_db;
INSERT INTO plans (id, name, description, price, billingCycle, trialEnabled, trialDays, createdAt, updatedAt)
VALUES 
  (1, 'Basic Plan', 'Basic features', 29.99, 'monthly', TRUE, 14, NOW(), NOW()),
  (2, 'Pro Plan', 'Pro features', 49.99, 'monthly', TRUE, 14, NOW(), NOW()),
  (3, 'Enterprise Plan', 'All features', 99.99, 'monthly', FALSE, 0, NOW(), NOW());

-- Create test promotion
USE promotion_db;
INSERT INTO promotions (code, name, description, type, discountValue, applicableTo, status, validFrom, validUntil, maxUses, currentUses, createdAt, updatedAt)
VALUES ('TEST50', 'Test Discount', '50% off', 'percentage', 50, 'all_plans', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100, 0, NOW(), NOW());
```

### 4. Start Microservices

```bash
# Terminal 1: Subscription Service
cd bmms
npm run start:dev subscription-svc

# Terminal 2: Catalogue Service
npm run start:dev catalogue-svc

# Terminal 3: Customer Service
npm run start:dev customer-svc

# Terminal 4: Billing Service
npm run start:dev billing-svc

# Terminal 5: Promotion Service
npm run start:dev promotion-svc

# Terminal 6: API Gateway
npm run start:dev api-gateway
```

---

## Manual Test Cases

### TEST 1: Create Subscription with Trial

```bash
# Request
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "planId": 1,
    "billingCycle": "monthly",
    "useTrial": true
  }'

# Expected Response:
{
  "id": 1,
  "customerId": 1,
  "planId": 1,
  "status": "trial",
  "amount": 29.99,
  "billingCycle": "monthly",
  "isTrialUsed": true,
  "trialStart": "2025-10-26T00:00:00Z",
  "trialEnd": "2025-11-09T00:00:00Z",
  "currentPeriodStart": "2025-10-26T00:00:00Z",
  "currentPeriodEnd": "2025-11-26T00:00:00Z"
}

# Verify in DB:
USE subscription_db;
SELECT * FROM subscriptions WHERE id = 1;
SELECT * FROM subscription_history WHERE subscriptionId = 1;
```

**✅ Success Criteria:**
- Subscription created with status = 'trial'
- Trial dates set correctly (14 days)
- History record created with action = 'created'

---

### TEST 2: Get Subscription Details

```bash
# Get by ID
curl http://localhost:3000/subscriptions/1

# Get by customer
curl http://localhost:3000/subscriptions/customer/1

# Expected: Returns subscription details
```

**✅ Success Criteria:**
- Returns correct subscription data
- All fields populated

---

### TEST 3: Apply Promotion Code

```bash
curl -X POST http://localhost:3000/promotions/apply \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST50",
    "subscriptionId": 1,
    "customerId": 1
  }'

# Expected Response:
{
  "success": true,
  "code": "TEST50",
  "discount": 50,
  "discountAmount": 14.995,
  "originalAmount": 29.99,
  "finalAmount": 14.995
}

# Verify in DB:
USE promotion_db;
SELECT * FROM promotion_usage WHERE subscriptionId = 1;
```

**✅ Success Criteria:**
- Promotion applied successfully
- Discount calculated correctly (50% off)
- Usage record created

---

### TEST 4: Convert Trial to Active (Payment)

```bash
curl -X POST http://localhost:3000/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": 1,
    "amount": 14.995,
    "paymentMethod": "credit_card"
  }'

# Wait 2 seconds for event processing

# Check subscription status
curl http://localhost:3000/subscriptions/1

# Expected: status = 'active'

# Verify in DB:
SELECT status FROM subscriptions WHERE id = 1;
-- Should be 'active'

SELECT * FROM subscription_history WHERE subscriptionId = 1 AND action = 'activated';
-- Should have activation record
```

**✅ Success Criteria:**
- Payment processed successfully
- Subscription status changed to 'active'
- History record created

---

### TEST 5: Upgrade Plan (Immediate with Proration)

```bash
curl -X PUT http://localhost:3000/subscriptions/1/change-plan \
  -H "Content-Type: application/json" \
  -d '{
    "newPlanId": 2,
    "immediate": true
  }'

# Expected Response includes:
{
  "id": 1,
  "planId": 2,
  "amount": 49.99,
  "metadata": {
    "lastProration": {
      "date": "...",
      "changeType": "upgrade",
      "oldAmount": 29.99,
      "newAmount": 49.99,
      "creditAmount": 16.00,
      "chargeAmount": 26.67,
      "netAmount": 10.67
    }
  }
}

# Check proration invoice
curl http://localhost:3000/invoices/customer/1

# Verify in DB:
SELECT * FROM subscriptions WHERE id = 1;
-- planId should be 2, amount should be 49.99

SELECT * FROM subscription_history WHERE subscriptionId = 1 AND action = 'plan_changed';

USE billing_db;
SELECT * FROM invoices WHERE subscriptionId = 1 AND invoiceType = 'proration_charge';
-- Should have proration invoice
```

**✅ Success Criteria:**
- Plan upgraded to Pro
- Proration calculated correctly
- Proration invoice created
- Charged ~$10.67 for remaining days

---

### TEST 6: Downgrade Plan (Period End)

```bash
curl -X PUT http://localhost:3000/subscriptions/1/change-plan \
  -H "Content-Type: application/json" \
  -d '{
    "newPlanId": 1,
    "immediate": false
  }'

# Expected: Plan change scheduled for period end
{
  "id": 1,
  "planId": 1,
  "message": "Plan will change at end of current period"
}

# Verify:
SELECT * FROM subscription_history WHERE subscriptionId = 1 AND action = 'plan_changed';
```

**✅ Success Criteria:**
- Plan change scheduled
- No immediate charge
- History recorded

---

### TEST 7: Pause and Resume Subscription

```bash
# Pause
curl -X PUT http://localhost:3000/subscriptions/1/pause \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer request"
  }'

# Expected: status = 'paused'

# Verify:
curl http://localhost:3000/subscriptions/1

# Resume
curl -X PUT http://localhost:3000/subscriptions/1/resume

# Expected: status = 'active'
```

**✅ Success Criteria:**
- Subscription paused successfully
- Resumed successfully
- History records created

---

### TEST 8: Get Subscription History

```bash
curl http://localhost:3000/subscriptions/1/history

# Expected: Array of history records
[
  { "action": "created", "details": "...", "createdAt": "..." },
  { "action": "activated", "details": "...", "createdAt": "..." },
  { "action": "plan_changed", "details": "...", "createdAt": "..." },
  { "action": "paused", "details": "...", "createdAt": "..." },
  { "action": "resumed", "details": "...", "createdAt": "..." }
]
```

**✅ Success Criteria:**
- All actions recorded
- Chronological order
- Details populated

---

### TEST 9: Subscription Renewal

```bash
# Trigger renewal (normally done by scheduler)
curl -X POST http://localhost:3000/subscriptions/1/renew

# Expected:
{
  "id": 1,
  "status": "active",
  "currentPeriodStart": "2025-11-26T00:00:00Z",
  "currentPeriodEnd": "2025-12-26T00:00:00Z"
}

# Check renewal invoice
curl http://localhost:3000/invoices/subscription/1

# Verify in DB:
USE billing_db;
SELECT * FROM invoices 
WHERE subscriptionId = 1 
  AND invoiceType = 'recurring' 
ORDER BY createdAt DESC 
LIMIT 1;
```

**✅ Success Criteria:**
- Billing period extended
- Renewal invoice created
- Status remains active

---

### TEST 10: Payment Failure

```bash
# Simulate payment failure
curl -X POST http://localhost:3000/payments/fail \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": 1,
    "reason": "insufficient_funds"
  }'

# Wait 2 seconds

# Check status
curl http://localhost:3000/subscriptions/1

# Expected: status = 'past_due'

# Retry payment
curl -X POST http://localhost:3000/payments/retry \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionId": 1,
    "amount": 49.99,
    "paymentMethod": "credit_card"
  }'

# Wait 2 seconds

# Check status again
curl http://localhost:3000/subscriptions/1

# Expected: status = 'active'
```

**✅ Success Criteria:**
- Status changed to past_due on failure
- Reactivated after successful retry
- History records all events

---

### TEST 11: Cancel Subscription

```bash
# Cancel at period end
curl -X DELETE http://localhost:3000/subscriptions/1 \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "No longer needed",
    "immediate": false
  }'

# Expected:
{
  "id": 1,
  "cancelAtPeriodEnd": true,
  "cancelledAt": "2025-10-26T...",
  "cancellationReason": "No longer needed",
  "currentPeriodEnd": "2025-12-26T00:00:00Z"
}

# Process cancellation (after period ends)
curl -X POST http://localhost:3000/subscriptions/1/process-cancellation

# Expected: status = 'cancelled'

# Verify:
SELECT status, cancelAtPeriodEnd, cancellationReason 
FROM subscriptions 
WHERE id = 1;
```

**✅ Success Criteria:**
- Cancellation scheduled
- Service continues until period end
- Status changes to cancelled after period

---

### TEST 12: Create Subscription without Trial

```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "planId": 2,
    "billingCycle": "yearly",
    "useTrial": false
  }'

# Expected:
{
  "id": 2,
  "status": "active",
  "isTrialUsed": false,
  "trialStart": null,
  "trialEnd": null
}
```

**✅ Success Criteria:**
- Created without trial
- Immediately active
- No trial dates

---

### TEST 13: Trial Already Used

```bash
# Try to create another trial subscription
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "planId": 3,
    "billingCycle": "monthly",
    "useTrial": true
  }'

# Expected: 400 Bad Request
{
  "statusCode": 400,
  "message": "Trial already used for this customer"
}
```

**✅ Success Criteria:**
- Request rejected
- Clear error message

---

## Automated E2E Test

Run the Jest E2E test suite:

```bash
# From bmms directory
npm run test:e2e subscription-svc
```

---

## Test Results Summary

After completing all tests, verify:

### Database State

```sql
-- Count subscriptions
USE subscription_db;
SELECT status, COUNT(*) as count 
FROM subscriptions 
GROUP BY status;

-- Count history records
SELECT COUNT(*) FROM subscription_history;

-- Check invoices
USE billing_db;
SELECT invoiceType, COUNT(*) as count 
FROM invoices 
WHERE subscriptionId IN (1, 2)
GROUP BY invoiceType;

-- Check promotion usage
USE promotion_db;
SELECT COUNT(*) FROM promotion_usage;
```

### Expected Counts:
- ✅ Subscriptions: 2-3 total (various statuses)
- ✅ History records: 15+ events
- ✅ Invoices: 3-5 (recurring, proration, etc.)
- ✅ Promotion usage: 1 record

---

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Database connection issues
```bash
# Verify MySQL is running
docker-compose ps

# Check connection
mysql -h 127.0.0.1 -P 3312 -u root -p
```

### gRPC connection errors
```bash
# Verify ports
netstat -an | grep 5005

# Check service health
curl http://localhost:3000/health
```

### Kafka event issues
```bash
# Check Kafka logs
docker-compose logs kafka

# List topics
docker exec -it bmms-kafka kafka-topics --list --bootstrap-server localhost:9092
```

---

## Clean Up

After testing:

```sql
-- Clear test data
USE subscription_db;
DELETE FROM subscription_history;
DELETE FROM subscriptions;

USE billing_db;
DELETE FROM invoices;

USE promotion_db;
DELETE FROM promotion_usage;

-- Or rollback migrations
mysql -u root -p < migrations/subscription/rollback_all.sql
mysql -u root -p < migrations/promotion/rollback_all.sql
mysql -u root -p < migrations/billing/rollback_subscription_columns.sql
```

---

## Success Metrics

All tests passing means:

✅ **Subscription Lifecycle Complete**
- Trial → Active → Renewal → Cancellation

✅ **Plan Changes Working**
- Upgrade/Downgrade with correct proration

✅ **Payment Handling Robust**
- Success, failure, and retry flows

✅ **Event System Functional**
- All events emitted and processed

✅ **Data Integrity Maintained**
- History, invoices, promotions tracked

🚀 **System is production-ready!**
