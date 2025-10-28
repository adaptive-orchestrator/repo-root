# Ví dụ LLM Output cho 2 Kịch bản

## 🎯 Business Model Mapping

### Retail Model
**Services cần deploy:**
- **Core (luôn có)**: AuthService, CustomerService, CRMOrchestratorService, APIGatewayService, CatalogueService, BillingService, PaymentService
- **Retail specific**: OrderService, InventoryService

### Subscription Model  
**Services cần deploy:**
- **Core (luôn có)**: AuthService, CustomerService, CRMOrchestratorService, APIGatewayService, CatalogueService, BillingService, PaymentService
- **Subscription specific**: SubscriptionService, PromotionService

### Freemium Model
**Services cần deploy:**
- **Core (luôn có)**: AuthService, CustomerService, CRMOrchestratorService, APIGatewayService, CatalogueService, BillingService, PaymentService
- **Freemium specific**: SubscriptionService (với free plan), PromotionService

---

## 📋 Kịch bản 1: Chuyển từ Retail sang Subscription

### User Input:
```
Chuyển đổi sản phẩm Premium Plan từ mô hình bán lẻ sang subscription theo tháng với giá 199,000 VNĐ
```

### LLM Output:
```json
{
  "proposal_text": "Yêu cầu chuyển đổi sản phẩm Premium Plan từ mô hình Retail (bán lẻ) sang mô hình Subscription với chu kỳ thanh toán hàng tháng. Giá subscription là 199,000 VNĐ/tháng. Hệ thống cần:\n1. Deploy SubscriptionService để quản lý đăng ký\n2. Deploy PromotionService để xử lý khuyến mãi subscription\n3. Cập nhật BillingService để xử lý thanh toán định kỳ\n4. Cập nhật PaymentService để hỗ trợ recurring payment\n5. Ngừng hoặc scale down OrderService và InventoryService (không cần cho subscription)\n6. Cập nhật CatalogueService để hiển thị pricing subscription",
  
  "changeset": {
    "model": "BusinessModel",
    "features": [
      {
        "key": "business_model",
        "value": "subscription"
      },
      {
        "key": "product_name",
        "value": "Premium Plan"
      },
      {
        "key": "billing_period",
        "value": "monthly"
      },
      {
        "key": "subscription_price",
        "value": 199000
      },
      {
        "key": "currency",
        "value": "VND"
      },
      {
        "key": "plan_name",
        "value": "Plan 1"
      }
    ],
    "impacted_services": [
      "SubscriptionService",
      "PromotionService",
      "BillingService",
      "PaymentService",
      "CatalogueService"
    ]
  },
  
  "metadata": {
    "intent": "business_model_change",
    "from_model": "retail",
    "to_model": "subscription",
    "confidence": 0.95,
    "risk": "high",
    "requires_data_migration": true,
    "estimated_downtime": "5 minutes"
  }
}
```

### Services được deploy:
```javascript
// NEW SERVICES
✅ SubscriptionService → subscription-svc (namespace: order, port: 3012)
✅ PromotionService → promotion-svc (namespace: product, port: 3009)

// UPDATED SERVICES (redeployed với config mới)
🔄 BillingService → billing-svc (finance:3003) 
   + ENV: BILLING_MODE=recurring, SUBSCRIPTION_ENABLED=true
   
🔄 PaymentService → payment-svc (finance:3015)
   + ENV: RECURRING_PAYMENT=true, AUTO_CHARGE=true
   
🔄 CatalogueService → catalogue-svc (product:3007)
   + ENV: DISPLAY_MODE=subscription, SHOW_PLANS=true

// SCALED DOWN (không xóa nhưng giảm replicas về 0)
⬇️ OrderService → order-svc (order:3011) - replicas: 0
⬇️ InventoryService → inventory-svc (order:3013) - replicas: 0

// ALWAYS RUNNING (không thay đổi)
✓ AuthService, CustomerService, CRMOrchestratorService
✓ APIGatewayService
```

---

## 📋 Kịch bản 2: Chuyển sang Multi-Model (Retail + Subscription + Freemium)

### User Input:
```
Chuyển đổi hệ thống sang hỗ trợ đa mô hình kinh doanh bao gồm: 2 sản phẩm Retail (bán lẻ thông thường), 1 gói Subscription (Plan 1 với giá 99k/tháng), và 1 gói Freemium (miễn phí với giới hạn tính năng)
```

### LLM Output:
```json
{
  "proposal_text": "Yêu cầu chuyển đổi hệ thống sang hỗ trợ đa mô hình kinh doanh (Multi-Model) để phục vụ nhiều phân khúc khách hàng:\n\n**Retail Model:**\n- 2 sản phẩm bán lẻ thông thường\n- Khách mua 1 lần, thanh toán ngay\n- Cần OrderService và InventoryService\n\n**Subscription Model:**\n- Plan 1: 99,000 VNĐ/tháng\n- Thanh toán định kỳ hàng tháng\n- Cần SubscriptionService và PromotionService\n\n**Freemium Model:**\n- Gói miễn phí với giới hạn tính năng\n- Có thể upgrade lên paid subscription\n- Dùng chung SubscriptionService với flag is_free=true\n\nHệ thống cần:\n1. Deploy đầy đủ cả 3 nhóm services (Retail, Subscription, Freemium)\n2. CatalogueService cần hỗ trợ hiển thị cả 3 loại products\n3. BillingService và PaymentService cần xử lý cả one-time và recurring payment\n4. API Gateway cần route đúng requests cho từng model\n5. Auth cần phân quyền theo từng loại subscription",
  
  "changeset": {
    "model": "MultiBusinessModel",
    "features": [
      {
        "key": "business_model",
        "value": "multi"
      },
      {
        "key": "supported_models",
        "value": "retail,subscription,freemium"
      },
      {
        "key": "retail_products_count",
        "value": 2
      },
      {
        "key": "subscription_plan_name",
        "value": "Plan 1"
      },
      {
        "key": "subscription_price",
        "value": 99000
      },
      {
        "key": "subscription_period",
        "value": "monthly"
      },
      {
        "key": "freemium_enabled",
        "value": true
      },
      {
        "key": "freemium_feature_limit",
        "value": "basic"
      }
    ],
    "impacted_services": [
      "OrderService",
      "InventoryService",
      "SubscriptionService",
      "PromotionService",
      "CatalogueService",
      "BillingService",
      "PaymentService",
      "APIGatewayService",
      "AuthService"
    ]
  },
  
  "metadata": {
    "intent": "business_model_expansion",
    "from_model": "single",
    "to_model": "multi",
    "confidence": 0.92,
    "risk": "high",
    "requires_data_migration": true,
    "requires_database_schema_update": true,
    "estimated_downtime": "10 minutes",
    "rollback_plan": "available"
  }
}
```

### Services được deploy:
```javascript
// RETAIL SERVICES (for retail products)
✅ OrderService → order-svc (order:3011, replicas: 2)
✅ InventoryService → inventory-svc (order:3013, replicas: 2)

// SUBSCRIPTION SERVICES (for subscription + freemium)
✅ SubscriptionService → subscription-svc (order:3012, replicas: 2)
   + ENV: SUPPORT_FREEMIUM=true, FREE_TIER_ENABLED=true
   
✅ PromotionService → promotion-svc (product:3009, replicas: 1)
   + ENV: MULTI_MODEL=true

// UPDATED CORE SERVICES
🔄 CatalogueService → catalogue-svc (product:3007, replicas: 2)
   + ENV: DISPLAY_MODE=multi, SHOW_ALL_MODELS=true
   
🔄 BillingService → billing-svc (finance:3003, replicas: 2)
   + ENV: PAYMENT_MODES=onetime,recurring
   
🔄 PaymentService → payment-svc (finance:3015, replicas: 2)
   + ENV: ONETIME_PAYMENT=true, RECURRING_PAYMENT=true
   
🔄 APIGatewayService → api-gateway (platform:3099, replicas: 2)
   + ENV: ROUTING_MODE=multi_model
   
🔄 AuthService → auth-svc (customer:3000, replicas: 2)
   + ENV: ROLE_BASED_ACCESS=true, FREEMIUM_TIER=true

// ALWAYS RUNNING (scale up để handle nhiều traffic hơn)
✓ CustomerService → customer-svc (replicas: 2)
✓ CRMOrchestratorService → crm-orchestrator (replicas: 1)

// PLATFORM SERVICES (optional but recommended)
✓ LLMOrchestratorService → llm-orchestrator (platform:3019)
✓ CodeIndexerService → code-indexer (platform:3018)
```

---

## ⚠️ QUAN TRỌNG: Shared Service Pattern

### Hiểu đúng về Scaling Pattern

**❌ SAI LẦM THƯỜNG GẶP**:
```
"Multi-model với 2 retail products → Tạo 2 cái order-svc?"
→ KHÔNG! Chỉ tạo 1 order-svc duy nhất
```

**✅ ĐÚNG**:
```javascript
// 1 SERVICE = XỬ LÝ NHIỀU PRODUCTS
OrderService (1 deployment) {
  replicas: 2,  // 2 pods để load balancing
  handles: [
    { product_id: 1, name: "Product A", type: "retail" },
    { product_id: 2, name: "Product B", type: "retail" },
    { product_id: 3, name: "Product C", type: "retail" },
    // ... có thể có 100+ products
  ]
}
```

### Database Structure
```sql
-- product_catalogue.products
+----+------------+--------+
| id | name       | type   |
+----+------------+--------+
| 1  | Product A  | retail |
| 2  | Product B  | retail |
+----+------------+--------+

-- order_service.orders
+----+------------+-------------+
| id | product_id | customer_id |
+----+------------+-------------+
| 1  | 1          | 123         | -- Order cho Product A
| 2  | 2          | 123         | -- Order cho Product B
| 3  | 1          | 456         | -- Order khác cho Product A
+----+------------+-------------+
```

### Khi nào cần Scale?

**Horizontal Scaling (tăng replicas)**:
```yaml
# Nhiều traffic → Tăng số pods
OrderService:
  replicas: 2  # → 5 pods nếu traffic cao
```

**KHÔNG tạo multiple services**:
```
❌ order-svc-product-a
❌ order-svc-product-b
✅ order-svc (handles all products via database)
```

---

## 🔍 So sánh 2 Kịch bản

### Kịch bản 1: Retail → Subscription
| Service | Action | Reason |
|---------|--------|--------|
| SubscriptionService | ✅ Deploy (1 service) | Cần cho subscription model |
| PromotionService | ✅ Deploy (1 service) | Hỗ trợ khuyến mãi subscription |
| OrderService | ⬇️ Scale to 0 | Không cần cho subscription |
| InventoryService | ⬇️ Scale to 0 | Không cần cho subscription |
| BillingService | 🔄 Update (1 service) | Thêm recurring payment |
| PaymentService | 🔄 Update (1 service) | Hỗ trợ auto-charge |

**Total services active**: ~7-8 services (NOT 7-8 services per subscription plan)

### Kịch bản 2: Multi-Model
| Service | Action | Reason |
|---------|--------|--------|
| OrderService | ✅ Deploy (1 service, replicas: 2) | Xử lý TẤT CẢ retail products |
| InventoryService | ✅ Deploy (1 service, replicas: 2) | Quản lý tồn kho cho TẤT CẢ products |
| SubscriptionService | ✅ Deploy (1 service) | Xử lý TẤT CẢ subscription + freemium plans |
| PromotionService | ✅ Deploy (1 service) | Khuyến mãi cho cả 3 models |
| All Core Services | 🔄 Update + Scale | Handle nhiều model đồng thời |

**Total services active**: ~12-13 services (NOT 12-13 per product)

**Note**: 
- `retail_products_count: 2` = 2 rows trong database, KHÔNG phải 2 order-svc instances
- 1 OrderService có thể handle 100+ retail products thông qua database differentiation

---

## 📊 Resource Requirements

### Kịch bản 1 (Subscription Only)
```yaml
Estimated resources:
  CPU: ~3-4 cores
  Memory: ~6-8 GB
  Pods: ~8-10 pods
  Storage: ~20 GB
```

### Kịch bản 2 (Multi-Model)
```yaml
Estimated resources:
  CPU: ~6-8 cores
  Memory: ~12-16 GB
  Pods: ~15-18 pods
  Storage: ~40 GB
```

---

## 🧪 Testing Commands

### Test Kịch bản 1:
```bash
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi sản phẩm Premium Plan từ mô hình bán lẻ sang subscription theo tháng với giá 199,000 VNĐ",
    "auto_deploy": true
  }'
```

### Test Kịch bản 2:
```bash
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi hệ thống sang hỗ trợ đa mô hình kinh doanh bao gồm: 2 sản phẩm Retail, 1 gói Subscription Plan 1 với giá 99k/tháng, và 1 gói Freemium miễn phí",
    "auto_deploy": true
  }'
```

### Verify Deployments:
```bash
# Check all namespaces
kubectl get deployments --all-namespaces

# Check specific services
kubectl get pods -n order
kubectl get pods -n finance
kubectl get pods -n product
kubectl get pods -n customer
kubectl get pods -n platform

# Check service details
kubectl describe deployment subscription-svc -n order
kubectl logs -n order deployment/subscription-svc --tail=50
```

---

## ✅ Validation Checklist

### Sau khi deploy Kịch bản 1:
- [ ] SubscriptionService running (replicas >= 1)
- [ ] PromotionService running
- [ ] OrderService scaled to 0 or deleted
- [ ] InventoryService scaled to 0 or deleted
- [ ] BillingService có env SUBSCRIPTION_ENABLED=true
- [ ] PaymentService có env RECURRING_PAYMENT=true
- [ ] ConfigMap updated với subscription configs

### Sau khi deploy Kịch bản 2:
- [ ] OrderService running (replicas >= 1)
- [ ] InventoryService running
- [ ] SubscriptionService running với SUPPORT_FREEMIUM=true
- [ ] PromotionService running
- [ ] CatalogueService có env DISPLAY_MODE=multi
- [ ] BillingService handle cả onetime và recurring
- [ ] PaymentService handle cả 2 payment modes
- [ ] All core services scaled appropriately
