# Promotion Service API Documentation

## Overview
Promotion Service quản lý discount codes, trial extensions, và free months cho subscription model.

## Base URL
```
http://localhost:3000/promotions
```

## Endpoints

### 1. Create Promotion
**POST** `/promotions`

Tạo promotion mới với các loại:
- `percentage` - Giảm theo % (ví dụ: 20%)
- `fixed_amount` - Giảm số tiền cố định (ví dụ: 50.000đ)
- `trial_extension` - Tăng thời gian trial (ví dụ: thêm 14 ngày)
- `free_months` - Tặng tháng miễn phí (ví dụ: 2 tháng)

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "name": "Summer Sale 2024",
  "description": "Get 20% off on all annual plans",
  "type": "percentage",
  "status": "active",
  "discountValue": 20,
  "applicableTo": "all_plans",
  "maxUses": 100,
  "maxUsesPerCustomer": 1,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z",
  "minPurchaseAmount": 100,
  "isFirstTimeOnly": true,
  "isRecurring": false
}
```

**Response:**
```json
{
  "id": 1,
  "code": "SUMMER2024",
  "name": "Summer Sale 2024",
  "type": "percentage",
  "status": "active",
  "discountValue": 20,
  "currentUses": 0,
  "createdAt": "2024-05-01T10:30:00Z"
}
```

---

### 2. Get All Promotions
**GET** `/promotions?status=active&limit=50&offset=0`

**Query Parameters:**
- `status` (optional): `active`, `inactive`, `expired`
- `limit` (optional): Default 50
- `offset` (optional): Default 0

**Response:**
```json
{
  "promotions": [
    {
      "id": 1,
      "code": "SUMMER2024",
      "name": "Summer Sale 2024",
      "type": "percentage",
      "status": "active",
      "discountValue": 20,
      "currentUses": 25
    }
  ],
  "total": 1
}
```

---

### 3. Get Promotion by ID
**GET** `/promotions/:id`

**Response:**
```json
{
  "id": 1,
  "code": "SUMMER2024",
  "name": "Summer Sale 2024",
  "description": "Get 20% off on all annual plans",
  "type": "percentage",
  "status": "active",
  "discountValue": 20,
  "applicableTo": "all_plans",
  "maxUses": 100,
  "currentUses": 25,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z"
}
```

---

### 4. Get Promotion by Code
**GET** `/promotions/code/:code`

**Example:** `/promotions/code/SUMMER2024`

**Response:** Same as Get by ID

---

### 5. Update Promotion
**PATCH** `/promotions/:id`

**Request Body:** (Partial update)
```json
{
  "status": "inactive",
  "maxUses": 200
}
```

**Response:** Updated promotion object

---

### 6. Delete Promotion
**DELETE** `/promotions/:id`

Soft delete - sets status to `inactive`

**Response:**
```json
{
  "success": true,
  "message": "Promotion 'SUMMER2024' has been deactivated"
}
```

---

### 7. Validate Promotion
**POST** `/promotions/validate`

Kiểm tra promotion có valid không và tính discount trước khi apply.

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "customerId": 1,
  "planId": 2,
  "purchaseAmount": 299.99
}
```

**Response:**
```json
{
  "valid": true,
  "promotion": {
    "id": 1,
    "code": "SUMMER2024",
    "type": "percentage",
    "discountValue": 20
  },
  "calculatedDiscount": {
    "originalAmount": 299.99,
    "discountAmount": 60,
    "finalAmount": 239.99
  }
}
```

**Error Response:**
```json
{
  "valid": false,
  "error": "Promotion is expired"
}
```

---

### 8. Apply Promotion
**POST** `/promotions/apply`

Apply promotion và ghi nhận usage.

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "customerId": 1,
  "planId": 2,
  "subscriptionId": 123,
  "purchaseAmount": 299.99
}
```

**Response:**
```json
{
  "success": true,
  "promotion": {
    "id": 1,
    "code": "SUMMER2024",
    "currentUses": 26
  },
  "discount": {
    "originalAmount": 299.99,
    "discountAmount": 60,
    "finalAmount": 239.99
  },
  "usageId": 456
}
```

---

### 9. Get Promotion Usage History
**GET** `/promotions/usage/history?promotionId=1&customerId=1&limit=50&offset=0`

**Query Parameters:**
- `promotionId` (optional): Filter by promotion
- `customerId` (optional): Filter by customer
- `limit` (optional): Default 50
- `offset` (optional): Default 0

**Response:**
```json
{
  "usages": [
    {
      "id": 456,
      "promotionId": 1,
      "customerId": 1,
      "subscriptionId": 123,
      "originalAmount": 299.99,
      "discountAmount": 60,
      "finalAmount": 239.99,
      "usedAt": "2024-06-15T14:30:00Z"
    }
  ],
  "total": 1
}
```

---

## Promotion Types

### 1. Percentage Discount
```json
{
  "type": "percentage",
  "discountValue": 20
}
```
→ Giảm 20% trên giá gốc

### 2. Fixed Amount Discount
```json
{
  "type": "fixed_amount",
  "discountValue": 50
}
```
→ Giảm 50 (đơn vị tiền tệ)

### 3. Trial Extension
```json
{
  "type": "trial_extension",
  "trialExtensionDays": 14
}
```
→ Tăng thêm 14 ngày trial

### 4. Free Months
```json
{
  "type": "free_months",
  "freeMonths": 2
}
```
→ Tặng 2 tháng miễn phí

---

## Applicability Rules

### All Plans
```json
{
  "applicableTo": "all_plans"
}
```
Áp dụng cho tất cả plans

### Specific Plans
```json
{
  "applicableTo": "specific_plans",
  "specificPlanIds": [1, 2, 3]
}
```
Chỉ áp dụng cho plans có ID trong danh sách

### First Time Only
```json
{
  "applicableTo": "first_time_only",
  "isFirstTimeOnly": true
}
```
Chỉ cho khách hàng mới

---

## Validation Rules

Promotion sẽ invalid nếu:
1. `status` != `active`
2. Hiện tại < `validFrom` hoặc > `validUntil`
3. `currentUses` >= `maxUses`
4. Customer đã dùng >= `maxUsesPerCustomer`
5. `purchaseAmount` < `minPurchaseAmount`
6. Không áp dụng cho plan này
7. `isFirstTimeOnly` = true nhưng customer không phải lần đầu

---

## Example Workflows

### Workflow 1: Customer Apply Discount at Checkout

```bash
# Step 1: Validate promotion trước
curl -X POST http://localhost:3000/promotions/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "customerId": 1,
    "planId": 2,
    "purchaseAmount": 299.99
  }'

# Response: valid=true, finalAmount=239.99

# Step 2: Customer confirm → Apply promotion
curl -X POST http://localhost:3000/promotions/apply \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "customerId": 1,
    "planId": 2,
    "subscriptionId": 123,
    "purchaseAmount": 299.99
  }'

# Response: success=true, usageId=456
```

### Workflow 2: Admin Create Promotion

```bash
# Create percentage discount promotion
curl -X POST http://localhost:3000/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWYEAR2025",
    "name": "New Year Sale",
    "description": "30% off for first 50 customers",
    "type": "percentage",
    "discountValue": 30,
    "applicableTo": "all_plans",
    "maxUses": 50,
    "maxUsesPerCustomer": 1,
    "validFrom": "2025-01-01T00:00:00Z",
    "validUntil": "2025-01-31T23:59:59Z",
    "isFirstTimeOnly": true
  }'
```

### Workflow 3: Trial Extension Promotion

```bash
# Create trial extension promotion
curl -X POST http://localhost:3000/promotions \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TRIAL30",
    "name": "Extended Trial",
    "description": "Get 30 days trial instead of 14",
    "type": "trial_extension",
    "trialExtensionDays": 16,
    "applicableTo": "all_plans",
    "isFirstTimeOnly": true
  }'
```

---

## Integration with Subscription Service

Khi customer tạo subscription với promotion code:

```typescript
// 1. Validate promotion
const validation = await promotionService.validate({
  code: 'SUMMER2024',
  customerId: 1,
  planId: 2,
  purchaseAmount: planPrice,
});

if (!validation.valid) {
  throw new Error(validation.error);
}

// 2. Create subscription với discounted price
const subscription = await subscriptionService.create({
  customerId: 1,
  planId: 2,
  // Nếu có trial extension
  trialDays: baseTrial + (validation.calculatedDiscount?.trialExtensionDays || 0),
});

// 3. Apply promotion để ghi nhận usage
const applied = await promotionService.apply({
  code: 'SUMMER2024',
  customerId: 1,
  planId: 2,
  subscriptionId: subscription.id,
  purchaseAmount: planPrice,
});

// 4. Create invoice với final amount
await billingService.createInvoice({
  subscriptionId: subscription.id,
  amount: validation.calculatedDiscount.finalAmount,
  promotionId: applied.promotion.id,
});
```

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Invalid input data | DTO validation failed |
| 404 | Promotion not found | ID or code không tồn tại |
| 409 | Code already exists | Duplicate promotion code |
| 400 | Promotion cannot be applied | Không đủ điều kiện |

---

## Testing Checklist

- [ ] Create promotion với từng type (percentage, fixed, trial, free)
- [ ] Validate promotion code
- [ ] Apply promotion và check usage count
- [ ] Test expiry date
- [ ] Test maxUses limit
- [ ] Test maxUsesPerCustomer limit
- [ ] Test minPurchaseAmount
- [ ] Test isFirstTimeOnly
- [ ] Test specific plans only
- [ ] Update promotion status
- [ ] Get usage history

---

## Database Schema

### Table: promotions
```sql
CREATE TABLE promotions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('percentage', 'fixed_amount', 'trial_extension', 'free_months'),
  status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
  discountValue DECIMAL(10,2),
  trialExtensionDays INT,
  freeMonths INT,
  applicableTo ENUM('all_plans', 'specific_plans', 'first_time_only'),
  specificPlanIds TEXT, -- JSON array
  maxUses INT,
  currentUses INT DEFAULT 0,
  maxUsesPerCustomer INT,
  validFrom TIMESTAMP,
  validUntil TIMESTAMP,
  minPurchaseAmount DECIMAL(10,2),
  isFirstTimeOnly BOOLEAN DEFAULT FALSE,
  isRecurring BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: promotion_usage
```sql
CREATE TABLE promotion_usage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  promotionId INT NOT NULL,
  customerId INT NOT NULL,
  subscriptionId INT,
  discountAmount DECIMAL(10,2),
  originalAmount DECIMAL(10,2),
  finalAmount DECIMAL(10,2),
  metadata TEXT, -- JSON
  usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (promotionId) REFERENCES promotions(id)
);
```
