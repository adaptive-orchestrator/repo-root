# 🧪 Testing Guide - LLM K8s Auto-Deployment

### 1. TypeScript Errors
- ✅ Fixed type definition cho `results` array trong `k8s-generator.service.ts`
- ✅ Updated service mapping với đầy đủ services
- ✅ Enhanced SYSTEM_PROMPT với business model context

### 2. Service Mapping Hoàn chỉnh

| Domain       | Service Name           | Technical Name   | Namespace | Port |
|--------------|------------------------|------------------|-----------|------|
| **Customer** | AuthService            | auth-svc         | customer  | 3000 |
|              | CustomerService        | customer-svc     | customer  | 3001 |
|              | CRMOrchestratorService | crm-orchestrator | customer  | 3002 |
| **Product**  | CatalogueService       | catalogue-svc    | product   | 3007 |
|              | PricingEngineService   | pricing-engine   | product   | 3008 |
|              | PromotionService       | promotion-svc    | product   | 3009 |
| **Order**    | OrderService           | order-svc        | order     | 3011 |
|              | SubscriptionService    | subscription-svc | order     | 3012 |
|              | InventoryService       | inventory-svc    | order     | 3013 |
| **Finance**  | BillingService         | billing-svc      | finance   | 3003 |
|              | PaymentService         | payment-svc      | finance   | 3015 |
| **Platform** | APIGatewayService      | api-gateway      | platform  | 3099 |
|              | LLMOrchestratorService | llm-orchestrator | platform  | 3019 |
|              | CodeIndexerService     | code-indexer     | platform  | 3018 |
|              | RLSchedulerService     | rl-scheduler     | platform  | 3017 |

---

## 🎬 Kịch bản 1: Retail → Subscription

### Input tiếng Việt:
```bash
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi sản phẩm Premium Plan từ mô hình bán lẻ sang subscription theo tháng với giá 199,000 VNĐ",
    "tenant_id": "tenant-demo",
    "role": "admin",
    "auto_deploy": true
  }'
```

### Expected LLM Output:
```json
{
  "proposal_text": "Chuyển từ Retail sang Subscription...",
  "changeset": {
    "model": "BusinessModel",
    "features": [
      {"key": "business_model", "value": "subscription"},
      {"key": "subscription_price", "value": 199000},
      {"key": "billing_period", "value": "monthly"}
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
    "risk": "high"
  }
}
```

### Expected K8s Actions:
```bash
# NEW DEPLOYMENTS
✅ kubectl apply -f subscription-svc-deployment.yaml -n order
✅ kubectl apply -f subscription-svc-service.yaml -n order
✅ kubectl apply -f promotion-svc-deployment.yaml -n product
✅ kubectl apply -f promotion-svc-service.yaml -n product

# UPDATES
🔄 kubectl set env deployment/billing-svc SUBSCRIPTION_ENABLED=true -n finance
🔄 kubectl set env deployment/payment-svc RECURRING_PAYMENT=true -n finance
🔄 kubectl set env deployment/catalogue-svc DISPLAY_MODE=subscription -n product

# SCALE DOWN (optional)
⬇️ kubectl scale deployment/order-svc --replicas=0 -n order
⬇️ kubectl scale deployment/inventory-svc --replicas=0 -n order
```

### Verify:
```bash
# Check deployments
kubectl get deployments -n order
kubectl get deployments -n product
kubectl get deployments -n finance

# Expect to see:
# order namespace: subscription-svc (replicas: 1), order-svc (replicas: 0), inventory-svc (replicas: 0)
# product namespace: promotion-svc (replicas: 1)
# finance namespace: billing-svc, payment-svc (updated)

# Check pods
kubectl get pods -n order
kubectl get pods -n product

# Check logs
kubectl logs -n order deployment/subscription-svc --tail=20
kubectl logs -n product deployment/promotion-svc --tail=20
```

---

## 🎬 Kịch bản 2: Multi-Model (Retail + Subscription + Freemium)

### Input tiếng Việt:
```bash
curl -X POST http://localhost:3019/llm/chat-and-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Chuyển đổi hệ thống sang hỗ trợ đa mô hình kinh doanh bao gồm: 2 sản phẩm Retail (bán lẻ thông thường), 1 gói Subscription Plan 1 với giá 99k/tháng, và 1 gói Freemium (miễn phí với giới hạn tính năng)",
    "tenant_id": "tenant-demo",
    "role": "admin",
    "auto_deploy": true
  }'
```

### Expected LLM Output:
```json
{
  "proposal_text": "Hệ thống multi-model...",
  "changeset": {
    "model": "MultiBusinessModel",
    "features": [
      {"key": "business_model", "value": "multi"},
      {"key": "supported_models", "value": "retail,subscription,freemium"},
      {"key": "retail_products_count", "value": 2},
      {"key": "subscription_price", "value": 99000},
      {"key": "freemium_enabled", "value": true}
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
    "to_model": "multi",
    "confidence": 0.92,
    "risk": "high"
  }
}
```

### Expected K8s Actions:
```bash
# RETAIL SERVICES
✅ kubectl apply -f order-svc-deployment.yaml -n order
✅ kubectl apply -f order-svc-service.yaml -n order
✅ kubectl apply -f inventory-svc-deployment.yaml -n order
✅ kubectl apply -f inventory-svc-service.yaml -n order

# SUBSCRIPTION SERVICES
✅ kubectl apply -f subscription-svc-deployment.yaml -n order
✅ kubectl apply -f subscription-svc-service.yaml -n order
✅ kubectl apply -f promotion-svc-deployment.yaml -n product
✅ kubectl apply -f promotion-svc-service.yaml -n product

# UPDATE ALL CORE SERVICES
🔄 kubectl set env deployment/catalogue-svc DISPLAY_MODE=multi SHOW_ALL_MODELS=true -n product
🔄 kubectl set env deployment/billing-svc PAYMENT_MODES=onetime,recurring -n finance
🔄 kubectl set env deployment/payment-svc ONETIME_PAYMENT=true RECURRING_PAYMENT=true -n finance
🔄 kubectl set env deployment/api-gateway ROUTING_MODE=multi_model -n platform
🔄 kubectl set env deployment/auth-svc FREEMIUM_TIER=true -n customer

# SCALE UP for higher traffic
🔄 kubectl scale deployment/catalogue-svc --replicas=2 -n product
🔄 kubectl scale deployment/billing-svc --replicas=2 -n finance
🔄 kubectl scale deployment/api-gateway --replicas=2 -n platform
```

### Verify:
```bash
# Check all namespaces
kubectl get deployments --all-namespaces | grep -E "(order|subscription|inventory|promotion|catalogue|billing|payment|auth|api-gateway)"

# Expected output:
# order:     order-svc (1-2 replicas), inventory-svc (1-2), subscription-svc (1-2)
# product:   catalogue-svc (2), promotion-svc (1)
# finance:   billing-svc (2), payment-svc (2)
# customer:  auth-svc (2), customer-svc (1-2)
# platform:  api-gateway (2)

# Detailed check
kubectl get pods -n order -o wide
kubectl get pods -n product -o wide
kubectl get pods -n finance -o wide

# Check environment variables
kubectl exec -n order deployment/subscription-svc -- env | grep -E "(BUSINESS|FREEMIUM|SUPPORT)"
kubectl exec -n finance deployment/billing-svc -- env | grep PAYMENT_MODES
kubectl exec -n product deployment/catalogue-svc -- env | grep DISPLAY_MODE
```

---

## 🔍 Debug Commands

### Check LLM Output (local files):
```bash
# Xem LLM output mới nhất
ls -lt bmms/llm_output/*.json | head -1
cat bmms/llm_output/$(ls -t bmms/llm_output/*.json | head -1)

# So sánh với expected output
diff bmms/llm_output/scenario1_retail_to_subscription.json <(cat bmms/llm_output/*.json | tail -1)
```

### Check K8s Generator Logs:
```bash
# Nếu chạy local
npm run start:k8s-generator:dev
# Xem console logs

# Nếu deploy trên K8s
kubectl logs -n platform deployment/k8s-generator -f --tail=100
```

### Check Template Rendering:
```bash
# Test template service riêng lẻ
curl -X POST http://localhost:3020/k8s/test-template \
  -H "Content-Type: application/json" \
  -d '{
    "name": "subscription-svc",
    "namespace": "order",
    "port": 3012,
    "replicas": 1,
    "image": "your-registry/subscription-svc:latest"
  }'
```

### Manual Deployment Test:
```bash
# Apply YAML manually
kubectl apply -f bmms/apps/platform/k8s-generator/src/templates/deployment.yaml -n order
kubectl apply -f bmms/apps/platform/k8s-generator/src/templates/service.yaml -n order

# Check status
kubectl rollout status deployment/subscription-svc -n order
kubectl get events -n order --sort-by='.lastTimestamp' | tail -20
```

---

## 📊 Validation Matrix

### Kịch bản 1 Checklist:

| Check | Command | Expected |
|-------|---------|----------|
| ✅ LLM parse OK | `curl POST /llm/chat` | JSON with impacted_services |
| ✅ K8s Generator called | Check logs | "Generating K8s manifests for..." |
| ✅ Templates rendered | Check logs | "Rendered deployment.yaml" |
| ✅ Subscription deployed | `kubectl get deploy -n order` | subscription-svc READY 1/1 |
| ✅ Promotion deployed | `kubectl get deploy -n product` | promotion-svc READY 1/1 |
| ✅ Order scaled down | `kubectl get deploy -n order` | order-svc READY 0/0 |
| ✅ Billing updated | `kubectl exec ... -- env` | SUBSCRIPTION_ENABLED=true |
| ✅ ConfigMap updated | `kubectl get cm env -n order -o yaml` | Contains new configs |

### Kịch bản 2 Checklist:

| Check | Command | Expected |
|-------|---------|----------|
| ✅ All retail services | `kubectl get deploy -n order` | order-svc, inventory-svc running |
| ✅ All subscription services | `kubectl get deploy -n order,product` | subscription-svc, promotion-svc |
| ✅ Catalogue multi-mode | `kubectl exec ...` | DISPLAY_MODE=multi |
| ✅ Billing dual-mode | `kubectl exec ...` | PAYMENT_MODES=onetime,recurring |
| ✅ API Gateway routing | `kubectl exec ...` | ROUTING_MODE=multi_model |
| ✅ Auth freemium support | `kubectl exec ...` | FREEMIUM_TIER=true |
| ✅ Services scaled | `kubectl get deploy --all-namespaces` | Core services replicas >= 2 |

---

## 🚨 Common Issues & Solutions

### Issue 1: LLM không trả về đúng format
**Symptom:** JSON parse error
**Solution:**
```bash
# Check SYSTEM_PROMPT
cat bmms/apps/platform/llm-orchestrator/src/llm-orchestrator.service.ts | grep -A 50 "SYSTEM_PROMPT"

# Test với provider khác
export LLM_PROVIDER=gemini  # hoặc deepseek
npm run start:llm:dev
```

### Issue 2: K8s Generator không apply được
**Symptom:** "Permission denied" hoặc "Cannot connect to K8s"
**Solution:**
```bash
# Check kubeconfig
kubectl cluster-info
echo $KUBECONFIG

# Apply RBAC
kubectl apply -f k8s/rbac/k8s-generator-rbac.yaml

# Test kubectl access
kubectl auth can-i create deployments --namespace=order
```

### Issue 3: Service không start được
**Symptom:** Pod CrashLoopBackOff
**Solution:**
```bash
# Check pod logs
kubectl logs -n order <pod-name> --previous

# Check events
kubectl describe pod -n order <pod-name>

# Common fixes:
# - Image pull error → Check DOCKER_REGISTRY env
# - Database connection → Check ConfigMap DB_* values
# - Missing env vars → Update ConfigMap
```

### Issue 4: Templates không render
**Symptom:** Invalid YAML generated
**Solution:**
```bash
# Check template files exist
ls bmms/apps/platform/k8s-generator/src/templates/

# Test handlebars syntax
npm install -g handlebars
handlebars bmms/apps/platform/k8s-generator/src/templates/deployment.yaml.hbs < test-data.json
```

---

## 📈 Performance Metrics

### Expected Response Times:

| Stage | Time | Notes |
|-------|------|-------|
| LLM Parse | 2-5s | Depends on provider (Gemini faster than DeepSeek) |
| Template Render | <100ms | Local operation |
| K8s Apply | 1-3s | Per service, depends on cluster |
| Pod Ready | 10-30s | Depends on image pull + startup |
| **Total** | **15-45s** | For full deployment |

### Monitor:
```bash
# Time the full flow
time curl -X POST http://localhost:3019/llm/chat-and-deploy -d '{"message":"..."}'

# Watch pods come up
kubectl get pods -n order -w
```

---

## 🎓 Demo Tips cho Khóa luận

1. **Prepare before demo:**
   ```bash
   # Start services
   npm run start:llm:dev &
   npm run start:k8s-generator:dev &
   
   # Open watch windows
   watch -n 2 'kubectl get deployments --all-namespaces'
   watch -n 2 'kubectl get pods --all-namespaces'
   ```

2. **Show the flow:**
   - Terminal 1: User input (curl command)
   - Terminal 2: LLM logs (parsing)
   - Terminal 3: K8s Generator logs (applying)
   - Terminal 4: kubectl watch (pods appearing)

3. **Explain each step:**
   - User speaks Vietnamese → LLM understands
   - LLM extracts services → JSON changeset
   - K8s Generator renders templates → YAML
   - Kubernetes applies → Pods running

4. **Highlight innovation:**
   - 🤖 AI/LLM for NLP
   - ☁️ Cloud-native auto-deployment
   - 📝 Template-based IaC
   - 🔄 Zero-downtime rolling updates

Good luck! 🚀
