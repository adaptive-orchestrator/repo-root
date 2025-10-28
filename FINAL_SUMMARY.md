# Hoàn thành - K8s Auto-Deployment với 2 Kịch bản

#### **Core Services (luôn cần cho mọi model):**
- **Customer Domain**: AuthService, CustomerService, CRMOrchestratorService
- **Platform Domain**: APIGatewayService
- **Product Domain**: CatalogueService
- **Finance Domain**: BillingService, PaymentService

#### **Retail Model cần thêm:**
- OrderService → order-svc
- InventoryService → inventory-svc

#### **Subscription Model cần thêm:**
- SubscriptionService → subscription-svc
- PromotionService → promotion-svc

#### **Multi-Model (cần tất cả):**
- Tất cả services trên

### 2. Enhanced SYSTEM_PROMPT
Đã cập nhật LLM prompt với:
- Business model definitions (Retail, Subscription, Freemium, Multi-Model)
- Service mapping chi tiết
- Intent types (business_model_change, business_model_expansion)
- Ví dụ cho 2 kịch bản

---

## 📋 Kịch bản 1: Retail → Subscription

**Input mẫu:**
> "Chuyển đổi sản phẩm Premium Plan từ mô hình bán lẻ sang subscription theo tháng với giá 199,000 VNĐ"

**LLM sẽ trả về:**
```json
{
  "changeset": {
    "model": "BusinessModel",
    "features": [
      {"key": "business_model", "value": "subscription"},
      {"key": "subscription_price", "value": 199000},
      {"key": "billing_period", "value": "monthly"},
      {"key": "plan_name", "value": "Plan 1"}
    ],
    "impacted_services": [
      "SubscriptionService",        // ✅ Deploy mới
      "PromotionService",           // ✅ Deploy mới
      "BillingService",             // 🔄 Update config
      "PaymentService",             // 🔄 Update config
      "CatalogueService"            // 🔄 Update display mode
    ]
  },
  "metadata": {
    "intent": "business_model_change",
    "from_model": "retail",
    "to_model": "subscription",
    "risk": "high"
  }
}
```

**Services actions:**
```
✅ NEW DEPLOYMENTS:
   - SubscriptionService (order namespace)
   - PromotionService (product namespace)

⬇️ SCALE DOWN/STOP:
   - OrderService → replicas: 0 (không cần cho subscription)
   - InventoryService → replicas: 0 (không cần cho subscription)

🔄 UPDATE CONFIG:
   - BillingService: SUBSCRIPTION_ENABLED=true
   - PaymentService: RECURRING_PAYMENT=true
   - CatalogueService: DISPLAY_MODE=subscription

✓ ALWAYS RUNNING:
   - Auth, Customer, CRM, API Gateway (không đổi)
```

---

## 📋 Kịch bản 2: Multi-Model (2 Retail + 1 Subscription + 1 Freemium)

**Input mẫu:**
> "Chuyển đổi hệ thống sang hỗ trợ đa mô hình kinh doanh: 2 sản phẩm Retail, 1 gói Subscription Plan 1 giá 99k/tháng, và 1 gói Freemium miễn phí"

**LLM sẽ trả về:**
```json
{
  "changeset": {
    "model": "MultiBusinessModel",
    "features": [
      {"key": "business_model", "value": "multi"},
      {"key": "supported_models", "value": "retail,subscription,freemium"},
      {"key": "retail_products_count", "value": 2},
      {"key": "subscription_price", "value": 99000},
      {"key": "subscription_plan_name", "value": "Plan 1"},
      {"key": "freemium_enabled", "value": true}
    ],
    "impacted_services": [
      "OrderService",              // ✅ Cho retail
      "InventoryService",          // ✅ Cho retail
      "SubscriptionService",       // ✅ Cho subscription + freemium
      "PromotionService",          // ✅ Cho subscription
      "CatalogueService",          // 🔄 Hiển thị tất cả models
      "BillingService",            // 🔄 Xử lý cả onetime + recurring
      "PaymentService",            // 🔄 Xử lý cả 2 loại payment
      "APIGatewayService",         // 🔄 Route theo model
      "AuthService"                // 🔄 Phân quyền theo tier
    ]
  },
  "metadata": {
    "intent": "business_model_expansion",
    "to_model": "multi",
    "risk": "high"
  }
}
```

**Services actions:**
```
✅ RETAIL SERVICES:
   - OrderService (order:3011) - replicas: 2
   - InventoryService (order:3013) - replicas: 2

✅ SUBSCRIPTION SERVICES:
   - SubscriptionService (order:3012) - replicas: 2
     ENV: SUPPORT_FREEMIUM=true, FREE_TIER_ENABLED=true
   - PromotionService (product:3009) - replicas: 1

🔄 UPDATE ALL CORE:
   - CatalogueService: DISPLAY_MODE=multi, SHOW_ALL_MODELS=true
   - BillingService: PAYMENT_MODES=onetime,recurring
   - PaymentService: ONETIME_PAYMENT=true, RECURRING_PAYMENT=true
   - APIGatewayService: ROUTING_MODE=multi_model
   - AuthService: FREEMIUM_TIER=true, ROLE_BASED_ACCESS=true

📈 SCALE UP (để handle nhiều traffic):
   - Tất cả core services → replicas: 2
```

---

## 🗂️ Files đã tạo

### 1. K8s Generator Service
```
bmms/apps/platform/k8s-generator/
├── src/
│   ├── main.ts
│   ├── k8s-generator.module.ts
│   ├── k8s-generator.controller.ts
│   ├── k8s-generator.service.ts              ✅ Updated mapping
│   ├── dto/
│   │   └── generate-deployment.dto.ts
│   ├── services/
│   │   ├── template.service.ts
│   │   └── k8s-client.service.ts
│   └── templates/
│       ├── deployment.yaml.hbs
│       ├── service.yaml.hbs
│       └── configmap.yaml.hbs
└── K8S_AUTO_DEPLOYMENT.md
```

### 2. LLM Orchestrator Updates
```
bmms/apps/platform/llm-orchestrator/
├── src/
│   ├── llm-orchestrator.service.ts          ✅ Enhanced SYSTEM_PROMPT
│   ├── llm-orchestrator.controller.ts       ✅ Added /chat-and-deploy
│   ├── llm-orchestrator.module.ts           ✅ Added K8sIntegrationService
│   └── service/
│       └── k8s-integration.service.ts       ✅ New service
└── LLM_OUTPUT_SCENARIOS.md                  ✅ Ví dụ 2 kịch bản
```

### 3. Example LLM Outputs
```
bmms/llm_output/
├── scenario1_retail_to_subscription.json    ✅ Kịch bản 1
└── scenario2_multi_model.json               ✅ Kịch bản 2
```

### 4. Documentation
```
repo-root/
├── K8S_DEPLOYMENT_GUIDE.md                  ✅ Hướng dẫn đầy đủ
├── IMPLEMENTATION_SUMMARY.md                ✅ Tóm tắt triển khai
├── TESTING_GUIDE.md                         ✅ Testing & validation
└── k8s/
    ├── namespaces.yaml
    └── rbac/
        └── k8s-generator-rbac.yaml
```

---

## 🚀 Cách chạy test

### Setup:
```bash
cd bmms
npm install
```

### Test Kịch bản 1:
```bash
# Terminal 1: LLM Service
npm run start:llm:dev

# Terminal 2: K8s Generator
npm run start:k8s-generator:dev

# Terminal 3: Test
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi sản phẩm Premium Plan từ mô hình bán lẻ sang subscription theo tháng với giá 199,000 VNĐ",
    "auto_deploy": true
  }'

# Terminal 4: Watch K8s
kubectl get deployments --all-namespaces -w
```

### Test Kịch bản 2:
```bash
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi hệ thống sang hỗ trợ đa mô hình: 2 sản phẩm Retail, 1 gói Subscription Plan 1 giá 99k/tháng, và 1 gói Freemium miễn phí",
    "auto_deploy": true
  }'
```

---

## 📊 Service Comparison

### Kịch bản 1 (Subscription Only):
| Service             | Status    | Replicas |
|---------------------|-----------|----------|
| SubscriptionService | Running   | 1-2      |
| PromotionService    | Running   | 1        |
| OrderService        | Stopped   | 0        |
| InventoryService    | Stopped   | 0        |
| Core Services       | Running   | 1        |
| **Total Pods**      | **~8-10** |          |

### Kịch bản 2 (Multi-Model):
| Service             | Status     | Replicas |
|---------------------|------------|----------|
| OrderService        | Running    | 2        |
| InventoryService    | Running    | 2        |
| SubscriptionService | Running    | 2        |
| PromotionService    | Running    | 1        |
| Core Services       | Scaled     | 2        |
| **Total Pods**      | **~15-18** |          |

---

## Validation

### Xác nhận mapping

**Core services (mọi model đều cần):**
- Auth, Customer, CRM (customer domain) ✓
- API Gateway (platform domain) ✓
- Catalogue (product domain) ✓
- Billing, Payment (finance domain) ✓

**Retail cần thêm:**
- Order, Inventory ✓

**Subscription cần thêm:**
- Subscription, Promotion ✓

**Freemium:**
- Dùng chung Subscription (với flag `is_free=true`) ✓

**Về platform domain:**
Bạn đúng - nên deploy nguyên domain nhưng:
- API Gateway: ✅ Bắt buộc
- LLM Orchestrator: ✅ Bắt buộc (đang dùng)
- Code Indexer: (dùng RAG)
- RL Scheduler: 

**Về product domain:**
- Catalogue: ✅ Bắt buộc
- Promotion: ✅ Cần cho subscription
- Pricing Engine: 🤔 Để sau khi code xong

---

## 🎓 Next Steps cho Khóa luận

1. **Build Docker images** cho các services:
   ```bash
   docker build -t your-registry/subscription-svc:latest -f apps/order/subscription-svc/Dockerfile .
   docker build -t your-registry/order-svc:latest -f apps/order/order-svc/Dockerfile .
   # ... các services khác
   ```

2. **Setup K8s cluster** (Minikube/Kind/Cloud)

3. **Test end-to-end** với 2 kịch bản

4. **Chuẩn bị demo** theo hướng dẫn trong `TESTING_GUIDE.md`

---

## 📚 Đọc thêm

- `K8S_DEPLOYMENT_GUIDE.md` - Hướng dẫn đầy đủ
- `LLM_OUTPUT_SCENARIOS.md` - Chi tiết 2 kịch bản
- `TESTING_GUIDE.md` - Validation & debugging

