# Test YAML Generation (Dry-Run Mode)
# Sinh YAML files nhưng KHÔNG apply vào K8s cluster

Write-Host "🧪 Testing YAML Generation (Dry-Run Mode)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$LLM_URL = "http://localhost:3019"

# Test Case 1: Retail → Subscription
Write-Host "📝 Test Case 1: Chuyển từ Retail sang Subscription" -ForegroundColor Yellow
Write-Host ""

$body1 = @{
    message = "Chuyển nhóm sản phẩm A sang mô hình subscription hàng tháng"
    tenant_id = "t-test"
    role = "admin"
    lang = "vi"
    auto_deploy = $true
} | ConvertTo-Json

Write-Host "Sending request to: $LLM_URL/llm/chat-and-deploy?dryRun=true" -ForegroundColor Gray

try {
    $response1 = Invoke-RestMethod -Uri "$LLM_URL/llm/chat-and-deploy?dryRun=true" `
        -Method Post `
        -Body $body1 `
        -ContentType "application/json"
    
    Write-Host "✅ Response received!" -ForegroundColor Green
    Write-Host ""
    Write-Host "LLM Proposal:" -ForegroundColor Cyan
    Write-Host $response1.llm.proposal_text -ForegroundColor White
    Write-Host ""
    Write-Host "Impacted Services:" -ForegroundColor Cyan
    $response1.llm.changeset.impacted_services | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""
    Write-Host "Mode: $($response1.mode)" -ForegroundColor Magenta
    Write-Host ""
    
    if ($response1.deployment.result.results) {
        Write-Host "Generated YAML Files:" -ForegroundColor Cyan
        $response1.deployment.result.results | ForEach-Object {
            if ($_.yamlFiles) {
                Write-Host "  📄 $($_.service):" -ForegroundColor Yellow
                Write-Host "     - $($_.yamlFiles.deploymentPath)" -ForegroundColor Green
                Write-Host "     - $($_.yamlFiles.servicePath)" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test Case 2: Multi-Model
Write-Host "📝 Test Case 2: Multi-Model (2 retail + 1 subscription)" -ForegroundColor Yellow
Write-Host ""

$body2 = @{
    message = "Tôi muốn có 2 sản phẩm retail và 1 gói subscription"
    tenant_id = "t-test"
    role = "admin"
    lang = "vi"
    auto_deploy = $true
} | ConvertTo-Json

Write-Host "Sending request to: $LLM_URL/llm/chat-and-deploy?dryRun=true" -ForegroundColor Gray

try {
    $response2 = Invoke-RestMethod -Uri "$LLM_URL/llm/chat-and-deploy?dryRun=true" `
        -Method Post `
        -Body $body2 `
        -ContentType "application/json"
    
    Write-Host "✅ Response received!" -ForegroundColor Green
    Write-Host ""
    Write-Host "LLM Proposal:" -ForegroundColor Cyan
    Write-Host $response2.llm.proposal_text -ForegroundColor White
    Write-Host ""
    Write-Host "Features:" -ForegroundColor Cyan
    $response2.llm.changeset.features | ForEach-Object {
        Write-Host "  - $($_.key): $($_.value)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Impacted Services:" -ForegroundColor Cyan
    $response2.llm.changeset.impacted_services | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""
    Write-Host "Mode: $($response2.mode)" -ForegroundColor Magenta
    Write-Host ""
    
    if ($response2.deployment.result.results) {
        Write-Host "Generated YAML Files:" -ForegroundColor Cyan
        $response2.deployment.result.results | ForEach-Object {
            if ($_.yamlFiles) {
                Write-Host "  📄 $($_.service):" -ForegroundColor Yellow
                Write-Host "     - $($_.yamlFiles.deploymentPath)" -ForegroundColor Green
                Write-Host "     - $($_.yamlFiles.servicePath)" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Test completed! Check folder: bmms/k8s_generated/" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Folder structure:" -ForegroundColor Cyan
Write-Host "   bmms/k8s_generated/" -ForegroundColor White
Write-Host "   ├── customer/" -ForegroundColor White
Write-Host "   ├── product/" -ForegroundColor White
Write-Host "   ├── order/" -ForegroundColor White
Write-Host "   ├── finance/" -ForegroundColor White
Write-Host "   └── platform/" -ForegroundColor White
