# Subscription API Documentation

## Overview
The Subscription API provides endpoints for managing SaaS subscription lifecycle including creating subscriptions, trial periods, plan changes, cancellations, and renewals.

## Base URL
```
http://localhost:3000/api/subscriptions
```

## Authentication
All endpoints require JWT authentication (to be implemented).
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create Subscription
Create a new subscription for a customer.

**Endpoint:** `POST /subscriptions`

**Request Body:**
```json
{
  "customerId": 1,
  "planId": 2,
  "useTrial": true,
  "promotionCode": "SAVE20"
}
```

**Response (201 Created):**
```json
{
  "subscription": {
    "id": 1,
    "customerId": 1,
    "planId": 2,
    "planName": "Premium Plan",
    "amount": 299000,
    "billingCycle": "monthly",
    "status": "trial",
    "currentPeriodStart": "2025-10-26T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z",
    "isTrialUsed": true,
    "trialStart": "2025-10-26T00:00:00.000Z",
    "trialEnd": "2025-11-09T00:00:00.000Z",
    "cancelAtPeriodEnd": false,
    "cancelledAt": null,
    "cancellationReason": null,
    "createdAt": "2025-10-26T00:00:00.000Z",
    "updatedAt": "2025-10-26T00:00:00.000Z"
  },
  "message": "Subscription created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid data or customer already has active subscription
- `404 Not Found` - Customer or Plan not found

---

### 2. Get Subscription by ID
Retrieve details of a specific subscription.

**Endpoint:** `GET /subscriptions/:id`

**Example:** `GET /subscriptions/1`

**Response (200 OK):**
```json
{
  "subscription": {
    "id": 1,
    "customerId": 1,
    "planId": 2,
    "planName": "Premium Plan",
    "amount": 299000,
    "billingCycle": "monthly",
    "status": "active",
    "currentPeriodStart": "2025-10-26T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z",
    "isTrialUsed": true,
    "cancelAtPeriodEnd": false,
    "createdAt": "2025-10-26T00:00:00.000Z",
    "updatedAt": "2025-10-26T00:00:00.000Z"
  },
  "message": "Subscription found"
}
```

**Error Response:**
- `404 Not Found` - Subscription not found

---

### 3. Get Customer Subscriptions
Get all subscriptions for a specific customer.

**Endpoint:** `GET /subscriptions/customer/:customerId`

**Example:** `GET /subscriptions/customer/1`

**Response (200 OK):**
```json
{
  "subscriptions": [
    {
      "id": 1,
      "customerId": 1,
      "planId": 2,
      "planName": "Premium Plan",
      "status": "active",
      "amount": 299000,
      "billingCycle": "monthly",
      "currentPeriodStart": "2025-10-26T00:00:00.000Z",
      "currentPeriodEnd": "2025-11-26T00:00:00.000Z",
      "createdAt": "2025-10-26T00:00:00.000Z"
    },
    {
      "id": 2,
      "customerId": 1,
      "planId": 1,
      "planName": "Basic Plan",
      "status": "cancelled",
      "amount": 99000,
      "billingCycle": "monthly",
      "cancelledAt": "2025-09-15T00:00:00.000Z",
      "createdAt": "2025-08-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Cancel Subscription
Cancel a subscription immediately or at the end of billing period.

**Endpoint:** `PATCH /subscriptions/:id/cancel`

**Example:** `PATCH /subscriptions/1/cancel`

**Request Body:**
```json
{
  "reason": "Too expensive",
  "cancelAtPeriodEnd": true
}
```

**Parameters:**
- `reason` (optional): Reason for cancellation
- `cancelAtPeriodEnd` (optional, default: false): 
  - `true`: Cancel at end of current billing period
  - `false`: Cancel immediately

**Response (200 OK):**
```json
{
  "subscription": {
    "id": 1,
    "status": "active",
    "cancelAtPeriodEnd": true,
    "cancellationReason": "Too expensive",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z"
  },
  "message": "Subscription cancelled successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Subscription already cancelled
- `404 Not Found` - Subscription not found

---

### 5. Renew Subscription
Manually renew a subscription (typically handled by scheduler).

**Endpoint:** `PATCH /subscriptions/:id/renew`

**Example:** `PATCH /subscriptions/1/renew`

**Response (200 OK):**
```json
{
  "subscription": {
    "id": 1,
    "status": "active",
    "currentPeriodStart": "2025-11-26T00:00:00.000Z",
    "currentPeriodEnd": "2025-12-26T00:00:00.000Z"
  },
  "message": "Subscription renewed successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Subscription cannot be renewed (e.g., cancelled)
- `404 Not Found` - Subscription not found

---

### 6. Change Plan
Upgrade or downgrade subscription plan.

**Endpoint:** `PATCH /subscriptions/:id/change-plan`

**Example:** `PATCH /subscriptions/1/change-plan`

**Request Body:**
```json
{
  "newPlanId": 3,
  "immediate": true
}
```

**Parameters:**
- `newPlanId`: ID of the new plan
- `immediate` (optional, default: false):
  - `true`: Apply change immediately (resets billing period)
  - `false`: Apply change at end of current billing period

**Response (200 OK):**
```json
{
  "subscription": {
    "id": 1,
    "planId": 3,
    "planName": "Enterprise Plan",
    "amount": 599000,
    "currentPeriodStart": "2025-10-26T00:00:00.000Z",
    "currentPeriodEnd": "2025-11-26T00:00:00.000Z"
  },
  "message": "Plan changed successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Can only change plan for active subscriptions
- `404 Not Found` - Subscription or new plan not found

---

## Subscription Status

| Status | Description |
|--------|-------------|
| `trial` | Customer is in trial period (free) |
| `active` | Subscription is active and billing |
| `past_due` | Payment failed, subscription grace period |
| `cancelled` | Subscription is cancelled |
| `expired` | Subscription has expired |

## Billing Cycles

| Cycle | Description |
|-------|-------------|
| `monthly` | Billed every month |
| `yearly` | Billed every year |

## Events Flow

### Create Subscription with Trial
```
1. POST /subscriptions (useTrial: true)
   ↓
2. subscription.created event emitted (status: trial)
   ↓
3. subscription.trial.started event emitted
   ↓
4. No invoice created during trial
   ↓
5. After trial ends: subscription.trial.ended event
   ↓
6. Status changes to 'active'
   ↓
7. First invoice created
   ↓
8. Payment processed
```

### Recurring Billing
```
1. Scheduler checks for renewals
   ↓
2. 3 days before period end
   ↓
3. subscription.renewed event
   ↓
4. New invoice created
   ↓
5. Automatic payment processing
   ↓
6. If payment succeeds: Continue
   If payment fails: Status → past_due
```

### Cancel Subscription
```
1. PATCH /subscriptions/:id/cancel
   ↓
2. If cancelAtPeriodEnd = true:
   - Set flag, subscription continues until period end
   - At period end: Status → expired
   
   If cancelAtPeriodEnd = false:
   - Status → cancelled immediately
   - No more billing
```

## Testing with cURL

### Create Subscription
```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customerId": 1,
    "planId": 2,
    "useTrial": true
  }'
```

### Get Subscription
```bash
curl -X GET http://localhost:3000/subscriptions/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Cancel Subscription
```bash
curl -X PATCH http://localhost:3000/subscriptions/1/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reason": "Too expensive",
    "cancelAtPeriodEnd": true
  }'
```

### Change Plan
```bash
curl -X PATCH http://localhost:3000/subscriptions/1/change-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "newPlanId": 3,
    "immediate": true
  }'
```

## Swagger Documentation

Once the API Gateway is running, you can access interactive API documentation at:
```
http://localhost:3000/api
```

## Notes

1. **Authentication**: Currently commented out in the code. Uncomment `@UseGuards(JwtAuthGuard)` in the controller when auth is ready.

2. **Trial Period**: 
   - Must be enabled on the plan (`trialEnabled: true`)
   - Customer can only use trial once per plan

3. **Automatic Renewal**:
   - Handled by scheduler service
   - Checks subscriptions 3 days before period end
   - Creates invoices and processes payments automatically

4. **Payment Integration**:
   - Currently supports test payment endpoints
   - Production should integrate with VNPay/Momo

5. **Proration**:
   - Not yet implemented for immediate plan changes
   - Should calculate prorated amount based on remaining days
