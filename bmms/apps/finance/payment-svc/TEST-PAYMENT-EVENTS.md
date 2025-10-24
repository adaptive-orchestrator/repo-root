# 🧪 Payment Event Testing Guide

## ✅ Hoàn thành

### 1. **PaymentService - Stub Methods**
- `createPendingPayment()` - Tạo pending payment từ invoice
- `createRetryPayment()` - Tạo payment attempt mới cho retry
- `markPaymentRefunded()` - Đánh dấu payment đã refund

### 2. **PaymentService - Event Emitter Methods**
- `emitPaymentSuccess()` - Emit payment.success event
- `emitPaymentFailed()` - Emit payment.failed event
- `emitPaymentRetry()` - Emit payment.retry event
- `emitPaymentInitiated()` - Emit payment.initiated event
- `emitPaymentRefunded()` - Emit payment.refunded event

### 3. **PaymentEventListener - Updated Handlers**
- `handleInvoiceCreated()` - Khởi tạo payment, emit payment.initiated
- `handlePaymentSuccess()` - Update payment thành công, update invoice
- `handlePaymentFailed()` - Handle failure với logic canRetry
- `handlePaymentRetry()` - Tạo retry attempt
- `handlePaymentRefunded()` - Process refund

### 4. **PaymentController - Test Endpoints**
Added 4 test endpoints để emit events manually:
- `POST /payments/:paymentId/test/success`
- `POST /payments/:paymentId/test/failed`
- `POST /payments/:paymentId/test/retry`
- `POST /payments/:paymentId/test/refunded`

---

## 🔥 Cách Test Event Flow

### Prerequisites
1. Start Kafka/Redpanda: `docker-compose up -d`
2. Start Payment Service: `npm run start payment-svc`
3. Có sẵn payment record trong database (hoặc tạo qua API)

---

### Test 1: Payment Success Flow

```bash
# Emit payment.success event
curl -X POST http://localhost:3013/payments/test-payment-123/test/success \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 1,
    "orderId": 100,
    "customerId": 50,
    "amount": 500000,
    "transactionId": "VNPAY-TXN-12345"
  }'
```

**Expected Result:**
- ✅ Payment marked as `completed`
- ✅ Invoice marked as `paid`
- ✅ Log: "💰 handlePaymentSuccess TRIGGERED"
- ✅ Log: "✅ Payment marked as successful"

---

### Test 2: Payment Failed Flow (with Retry)

```bash
# Emit payment.failed event with canRetry=true
curl -X POST http://localhost:3013/payments/test-payment-456/test/failed \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 2,
    "orderId": 101,
    "customerId": 51,
    "amount": 750000,
    "reason": "Insufficient balance",
    "errorCode": "VNPAY_ERR_001",
    "canRetry": true
  }'
```

**Expected Result:**
- ✅ Payment marked as `failed`
- ✅ Invoice remains `pending`
- ✅ Log: "🔄 Payment can be retried - sending retry notification"
- ✅ Log: "❌ handlePaymentFailed TRIGGERED"

---

### Test 3: Payment Failed Flow (No Retry)

```bash
# Emit payment.failed event with canRetry=false
curl -X POST http://localhost:3013/payments/test-payment-789/test/failed \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 3,
    "orderId": 102,
    "customerId": 52,
    "amount": 1000000,
    "reason": "Fraud detected",
    "errorCode": "VNPAY_FRAUD_001",
    "canRetry": false
  }'
```

**Expected Result:**
- ✅ Payment marked as `failed`
- ✅ Log: "🚫 Payment cannot be retried - manual intervention required"
- ✅ Support team alert (TODO - currently commented)

---

### Test 4: Payment Retry Flow

```bash
# Emit payment.retry event
curl -X POST http://localhost:3013/payments/test-payment-retry-1/test/retry \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 2,
    "orderId": 101,
    "customerId": 51,
    "amount": 750000,
    "retryCount": 1,
    "previousFailureReason": "Insufficient balance"
  }'
```

**Expected Result:**
- ✅ New retry payment created
- ✅ Log: "🔄 handlePaymentRetry TRIGGERED"
- ✅ Log: "✅ Retry payment created: {newPaymentId}"
- ✅ VNPay URL generation (TODO - currently commented)

---

### Test 5: Payment Refund Flow

```bash
# Emit payment.refunded event
curl -X POST http://localhost:3013/payments/test-payment-123/test/refunded \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": 1,
    "orderId": 100,
    "customerId": 50,
    "refundAmount": 500000,
    "reason": "Customer request"
  }'
```

**Expected Result:**
- ✅ Payment marked as refunded (status: 'failed' với reason 'REFUNDED:...')
- ✅ Log: "💰 handlePaymentRefunded TRIGGERED"
- ✅ Log: "✅ Payment marked as refunded"
- ✅ VNPay refund API call (TODO - currently commented)

---

## 📊 Check Kafka Events

### Monitor Kafka Topics
```bash
# Check payment.success topic
docker exec -it redpanda rpk topic consume payment.success --brokers localhost:9092

# Check payment.failed topic
docker exec -it redpanda rpk topic consume payment.failed --brokers localhost:9092

# Check payment.retry topic
docker exec -it redpanda rpk topic consume payment.retry --brokers localhost:9092

# Check payment.refunded topic
docker exec -it redpanda rpk topic consume payment.refunded --brokers localhost:9092
```

---

## 🔍 Debug Tips

### 1. Check Payment Service Logs
```bash
# Tìm log của payment-svc
# Look for these patterns:
# - "💰 handlePaymentSuccess TRIGGERED"
# - "❌ handlePaymentFailed TRIGGERED"
# - "🔄 handlePaymentRetry TRIGGERED"
# - "💰 handlePaymentRefunded TRIGGERED"
```

### 2. Check Database
```sql
-- Check payment records
SELECT id, invoiceId, status, totalAmount, transactionId, failureReason 
FROM payments 
WHERE id = 'test-payment-123';

-- Check payment history
SELECT * FROM payment_history 
WHERE paymentId = 'test-payment-123' 
ORDER BY createdAt DESC;
```

### 3. Check Event Flow
1. **Order Created** → Inventory Reserved → Invoice Created
2. **Invoice Created** → Payment Initiated (handleInvoiceCreated)
3. **Payment Success** → Payment Completed + Invoice Paid (handlePaymentSuccess)
4. **Payment Failed** → Retry Logic (handlePaymentFailed)
5. **Payment Retry** → New Payment Attempt (handlePaymentRetry)

---

## ⚠️ Known Limitations (TODOs)

### VNPay Integration (Commented Out)
- [ ] `vnpayService.createPaymentUrl()` - Generate payment URL
- [ ] `vnpayService.verifySignature()` - Verify callback signature
- [ ] `vnpayService.processRefund()` - Process refund via VNPay API

### Notification Service (Commented Out)
- [ ] `notificationService.sendInvoiceCreated()` - Email invoice with payment link
- [ ] `notificationService.sendPaymentConfirmation()` - Email payment receipt
- [ ] `notificationService.sendPaymentFailureNotice()` - Email retry link
- [ ] `notificationService.alertSupportTeam()` - Alert for manual intervention

### Order Service Integration (Commented Out)
- [ ] `orderService.updatePaymentStatus()` - Update order payment status

---

## 🎯 Next Steps

1. **Implement VNPayService**
   - Create payment URL
   - Handle VNPay callback
   - Process refunds

2. **Add NotificationService**
   - Email templates
   - SMS notifications
   - Push notifications

3. **Order Service Integration**
   - Update order.paymentStatus
   - Trigger order fulfillment on payment success

4. **Error Handling**
   - Retry logic with exponential backoff
   - Dead letter queue for failed events
   - Circuit breaker pattern

---

## 📝 Example Complete Flow

```bash
# 1. Tạo Order (từ Order Service)
# → Emit order.created event

# 2. Inventory Reserve (Inventory Service)
# → Emit inventory.reserved event

# 3. Billing Create Invoice (Billing Service)
# → Emit invoice.created event

# 4. Payment Initiated (Payment Service - handleInvoiceCreated)
# → Emit payment.initiated event

# 5. Customer pays via VNPay (mock with test endpoint)
curl -X POST http://localhost:3013/payments/{paymentId}/test/success \
  -d '{"invoiceId": 1, "amount": 500000, "orderId": 100, "customerId": 50}'

# 6. Payment Success (Payment Service - handlePaymentSuccess)
# → Update payment status to 'completed'
# → Update invoice status to 'paid'
# → TODO: Notify Order Service
# → TODO: Send receipt to customer
```

---

## 🚀 Production Checklist

- [ ] Remove test endpoints (or guard with feature flag)
- [ ] Implement VNPay integration
- [ ] Add notification service
- [ ] Add monitoring & alerting
- [ ] Add idempotency keys for event handlers
- [ ] Add circuit breaker for external services
- [ ] Add rate limiting for VNPay API calls
- [ ] Add comprehensive error logging
- [ ] Add event replay mechanism
- [ ] Add saga compensation patterns

---

**Status:** ✅ All stub methods và event emitters implemented  
**VNPay Integration:** ⏳ Deferred (TODOs in place)  
**Testing:** ✅ Test endpoints ready for manual testing
