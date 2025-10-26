# Testing Subscription Model - Quick Start Guide

## 🚀 Prerequisites

1. **Services Running:**
   - Kafka/Redpanda (port 9092)
   - MySQL databases for all services
   - API Gateway (port 3000)
   - Customer Service (gRPC 50054)
   - Catalogue Service (gRPC 50055)
   - Subscription Service (gRPC 50059)
   - Billing Service (gRPC 50058)
   - Payment Service (gRPC 50060)

2. **Environment Variables:**
   Check `.env` file has all required configurations

## 📦 Start Services

### 1. Start Kafka (if using Docker)
```bash
docker-compose up -d redpanda
```

### 2. Start MySQL Databases
```bash
docker-compose up -d mysql
```

### 3. Start Microservices (from bmms directory)

```bash
# Terminal 1 - Customer Service
npm run start customer-svc

# Terminal 2 - Catalogue Service  
npm run start catalogue-svc

# Terminal 3 - Subscription Service
npm run start subscription-svc

# Terminal 4 - Billing Service
npm run start billing-svc

# Terminal 5 - Payment Service
npm run start payment-svc

# Terminal 6 - API Gateway
npm run start api-gateway
```

## 🧪 Test Flow

### Step 1: Create a Customer
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "0123456789",
    "address": "123 Main St"
  }'
```

**Expected Response:**
```json
{
  "customer": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "segment": "bronze",
    "status": "active"
  }
}
```

### Step 2: Create a Plan with Trial
```bash
curl -X POST http://localhost:3000/catalogue/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Plan",
    "description": "Full access to all features",
    "price": 299000,
    "billingCycle": "monthly",
    "trialEnabled": true,
    "trialDays": 14,
    "features": []
  }'
```

**Expected Response:**
```json
{
  "plan": {
    "id": 1,
    "name": "Premium Plan",
    "price": 299000,
    "billingCycle": "monthly",
    "trialEnabled": true,
    "trialDays": 14
  }
}
```

### Step 3: Create Subscription with Trial
```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "planId": 1,
    "useTrial": true
  }'
```

**Expected Response:**
```json
{
  "subscription": {
    "id": 1,
    "customerId": 1,
    "planId": 1,
    "planName": "Premium Plan",
    "amount": 299000,
    "billingCycle": "monthly",
    "status": "trial",
    "currentPeriodStart": "2025-10-26T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z",
    "trialStart": "2025-10-26T00:00:00.000Z",
    "trialEnd": "2025-11-09T00:00:00.000Z",
    "isTrialUsed": true
  },
  "message": "Subscription created successfully"
}
```

**What happens:**
- ✅ Subscription created with status "trial"
- ✅ Event `subscription.created` emitted
- ✅ Event `subscription.trial.started` emitted
- ✅ Billing service receives events but doesn't create invoice (trial is free)

### Step 4: Check Subscription Status
```bash
curl -X GET http://localhost:3000/subscriptions/1
```

### Step 5: Get Customer's Subscriptions
```bash
curl -X GET http://localhost:3000/subscriptions/customer/1
```

### Step 6: Create Subscription WITHOUT Trial
```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "planId": 1,
    "useTrial": false
  }'
```

**What happens:**
- ✅ Subscription created with status "active"
- ✅ Event `subscription.created` emitted
- ✅ Billing service creates first invoice
- ✅ Event `invoice.created` emitted
- ✅ Payment service creates payment record
- ✅ Event `payment.initiated` emitted

### Step 7: Check Invoice Created
```bash
curl -X GET http://localhost:3000/invoices/subscription/2
```

**Expected Response:**
```json
{
  "invoices": [
    {
      "id": 1,
      "invoiceNumber": "INV-2025-10-00001",
      "subscriptionId": 2,
      "customerId": 2,
      "invoiceType": "recurring",
      "totalAmount": 299000,
      "status": "draft",
      "periodStart": "2025-10-26T00:00:00.000Z",
      "periodEnd": "2025-11-26T00:00:00.000Z"
    }
  ]
}
```

### Step 8: Simulate Payment Success
```bash
# First, get the payment ID from invoice
curl -X GET http://localhost:3000/invoices/1

# Then mark payment as successful
curl -X POST http://localhost:3000/payments/1/test/success
```

**What happens:**
- ✅ Event `payment.success` emitted
- ✅ Billing service updates invoice status to "paid"
- ✅ Subscription continues as "active"

### Step 9: Change Plan (Upgrade)
```bash
# First create a higher tier plan
curl -X POST http://localhost:3000/catalogue/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise Plan",
    "description": "Premium features + priority support",
    "price": 599000,
    "billingCycle": "monthly",
    "trialEnabled": false,
    "features": []
  }'

# Then change subscription plan
curl -X PATCH http://localhost:3000/subscriptions/2/change-plan \
  -H "Content-Type: application/json" \
  -d '{
    "newPlanId": 2,
    "immediate": true
  }'
```

**What happens:**
- ✅ Subscription plan updated
- ✅ Event `subscription.plan.changed` emitted
- ✅ If immediate=true: New billing period starts, new invoice created
- ✅ If immediate=false: Change applied at end of current period

### Step 10: Cancel Subscription
```bash
# Cancel at end of period
curl -X PATCH http://localhost:3000/subscriptions/2/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Switching to competitor",
    "cancelAtPeriodEnd": true
  }'
```

**Expected Response:**
```json
{
  "subscription": {
    "id": 2,
    "status": "active",
    "cancelAtPeriodEnd": true,
    "cancellationReason": "Switching to competitor",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z"
  },
  "message": "Subscription cancelled successfully"
}
```

**What happens:**
- ✅ Event `subscription.cancelled` emitted
- ✅ Subscription marked for cancellation
- ✅ Continues until `currentPeriodEnd`
- ✅ No new invoices will be created
- ✅ At period end: Status changes to "expired"

### Step 11: Manual Renewal (for testing)
```bash
curl -X PATCH http://localhost:3000/subscriptions/1/renew
```

**What happens:**
- ✅ Subscription period extended
- ✅ Event `subscription.renewed` emitted
- ✅ Billing service creates new invoice
- ✅ Payment processed automatically

## 🔍 Verify Events in Logs

Watch the terminal logs for each service to see events being processed:

**Subscription Service logs:**
```
🔵 [SubscriptionSvc.create] START
✅ [SubscriptionSvc.create] Subscription created: 1
📤 Emitting SUBSCRIPTION_CREATED event
📤 Emitting SUBSCRIPTION_TRIAL_STARTED event
```

**Billing Service logs:**
```
📥 [billing-group] Received SUBSCRIPTION_CREATED event
ℹ️ Subscription 1 is on trial, invoice will be created after trial
```

**Payment Service logs:**
```
📥 [payment-group] Received INVOICE_CREATED event
✅ Payment record created for invoice INV-2025-10-00001
```

## 🐛 Troubleshooting

### Issue: gRPC connection refused
```
Error: 14 UNAVAILABLE: No connection established
```
**Solution:** Make sure the target service is running and listening on correct port

### Issue: Customer not found
```
404 Not Found: Customer X not found
```
**Solution:** Create customer first using customer API

### Issue: Plan not found
```
404 Not Found: Plan X not found
```
**Solution:** Create plan first using catalogue API

### Issue: Invoice not created
**Check:**
1. Is Kafka/Redpanda running?
2. Is Billing Service connected to Kafka?
3. Check billing service logs for errors
4. Verify subscription status is "active" (not "trial")

### Issue: Payment not processing
**Check:**
1. Is Payment Service running?
2. Is invoice in "draft" status?
3. Check payment service logs
4. Verify invoice was created successfully

## 📊 Check Database

### Check Subscriptions
```sql
SELECT * FROM subscriptions;
```

### Check Invoices
```sql
SELECT * FROM invoices WHERE invoiceType = 'recurring';
```

### Check Subscription History
```sql
SELECT * FROM subscription_history ORDER BY createdAt DESC;
```

## 🎯 Next Steps

1. **Test Trial Expiration:**
   - Manually update `trialEnd` date in database to past date
   - Run scheduler or manually call convert trial endpoint
   - Verify first invoice is created

2. **Test Auto-Renewal:**
   - Set up scheduler service
   - Wait for subscription period to end (or manually trigger)
   - Verify new invoice is created and payment processed

3. **Test Payment Failure:**
   - Use test endpoint to simulate payment failure
   - Verify subscription status changes to "past_due"
   - Verify retry logic kicks in

4. **Test Proration:**
   - Implement proration logic
   - Change plan mid-cycle with immediate=true
   - Verify prorated amount is calculated correctly

## 📝 Swagger UI

Access interactive API documentation:
```
http://localhost:3000/api
```

Navigate to **Subscriptions** tag to test all endpoints interactively.

## ✅ Success Checklist

- [ ] Customer created successfully
- [ ] Plan created with trial enabled
- [ ] Subscription created with trial (no invoice)
- [ ] Subscription created without trial (invoice created)
- [ ] Payment processed successfully
- [ ] Plan changed (upgrade/downgrade)
- [ ] Subscription cancelled
- [ ] Subscription renewed
- [ ] All events flowing correctly through Kafka
- [ ] All database records created properly

## 🎉 Congratulations!

You've successfully tested the Subscription model! 

The system now supports:
- ✅ Trial periods
- ✅ Recurring billing
- ✅ Plan changes
- ✅ Subscription lifecycle management
- ✅ Event-driven architecture
