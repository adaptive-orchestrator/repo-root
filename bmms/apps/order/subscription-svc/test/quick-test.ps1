# Quick E2E Test Script (PowerShell)
# Run individual test cases quickly

$API_BASE = "http://localhost:3000"
$CUSTOMER_ID = 1
$BASIC_PLAN_ID = 1
$PRO_PLAN_ID = 2
$PROMO_CODE = "TEST50"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }

# Store subscription ID globally
$global:SUBSCRIPTION_ID = $null

# Helper function for API calls
function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Path,
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Method = $Method
            Uri = "$API_BASE$Path"
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Error "API Error: $($_.Exception.Message)"
        if ($_.ErrorDetails) {
            Write-Error $_.ErrorDetails.Message
        }
        return $null
    }
}

# Test 1: Create Subscription with Trial
function Test-CreateSubscription {
    Write-Info "`n📝 TEST 1: Creating subscription with trial..."
    
    $body = @{
        customerId = $CUSTOMER_ID
        planId = $BASIC_PLAN_ID
        billingCycle = "monthly"
        useTrial = $true
    }
    
    $result = Invoke-ApiCall -Method POST -Path "/subscriptions" -Body $body
    
    if ($result) {
        $global:SUBSCRIPTION_ID = $result.id
        Write-Success "✅ Subscription created: ID=$($result.id), Status=$($result.status)"
        Write-Info "   Trial: $($result.trialStart) to $($result.trialEnd)"
        return $result
    }
    else {
        Write-Error "❌ Failed to create subscription"
        return $null
    }
}

# Test 2: Get Subscription
function Test-GetSubscription {
    param([int]$SubId = $global:SUBSCRIPTION_ID)
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 2: Getting subscription details..."
    
    $result = Invoke-ApiCall -Method GET -Path "/subscriptions/$SubId"
    
    if ($result) {
        Write-Success "✅ Subscription retrieved"
        Write-Host ($result | ConvertTo-Json -Depth 5)
        return $result
    }
}

# Test 3: Apply Promotion
function Test-ApplyPromotion {
    param(
        [int]$SubId = $global:SUBSCRIPTION_ID,
        [string]$Code = $PROMO_CODE
    )
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 3: Applying promotion code..."
    
    $body = @{
        code = $Code
        subscriptionId = $SubId
        customerId = $CUSTOMER_ID
    }
    
    $result = Invoke-ApiCall -Method POST -Path "/promotions/apply" -Body $body
    
    if ($result) {
        Write-Success "✅ Promotion applied: $($result.discount)% off"
        Write-Info "   Original: `$$($result.originalAmount)"
        Write-Info "   Final: `$$($result.finalAmount)"
        return $result
    }
}

# Test 4: Process Payment
function Test-ProcessPayment {
    param(
        [int]$SubId = $global:SUBSCRIPTION_ID,
        [decimal]$Amount = 29.99
    )
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 4: Processing payment..."
    
    $body = @{
        subscriptionId = $SubId
        amount = $Amount
        paymentMethod = "credit_card"
    }
    
    $result = Invoke-ApiCall -Method POST -Path "/payments/process" -Body $body
    
    if ($result) {
        Write-Success "✅ Payment processed"
        Start-Sleep -Seconds 2
        
        # Check status
        $sub = Test-GetSubscription -SubId $SubId
        if ($sub.status -eq "active") {
            Write-Success "✅ Subscription activated"
        }
        return $result
    }
}

# Test 5: Upgrade Plan
function Test-UpgradePlan {
    param(
        [int]$SubId = $global:SUBSCRIPTION_ID,
        [int]$NewPlanId = $PRO_PLAN_ID
    )
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 5: Upgrading plan with proration..."
    
    $body = @{
        newPlanId = $NewPlanId
        immediate = $true
    }
    
    $result = Invoke-ApiCall -Method PUT -Path "/subscriptions/$SubId/change-plan" -Body $body
    
    if ($result -and $result.metadata.lastProration) {
        Write-Success "✅ Plan upgraded"
        $proration = $result.metadata.lastProration
        Write-Info "   Change type: $($proration.changeType)"
        Write-Info "   Credit: `$$($proration.creditAmount)"
        Write-Info "   Charge: `$$($proration.chargeAmount)"
        Write-Info "   Net: `$$($proration.netAmount)"
        return $result
    }
}

# Test 6: Downgrade Plan
function Test-DowngradePlan {
    param(
        [int]$SubId = $global:SUBSCRIPTION_ID,
        [int]$NewPlanId = $BASIC_PLAN_ID
    )
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 6: Downgrading plan..."
    
    $body = @{
        newPlanId = $NewPlanId
        immediate = $false
    }
    
    $result = Invoke-ApiCall -Method PUT -Path "/subscriptions/$SubId/change-plan" -Body $body
    
    if ($result) {
        Write-Success "✅ Plan downgrade scheduled"
        return $result
    }
}

# Test 7: Pause Subscription
function Test-PauseSubscription {
    param([int]$SubId = $global:SUBSCRIPTION_ID)
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 7: Pausing subscription..."
    
    $body = @{
        reason = "Testing pause functionality"
    }
    
    $result = Invoke-ApiCall -Method PUT -Path "/subscriptions/$SubId/pause" -Body $body
    
    if ($result -and $result.status -eq "paused") {
        Write-Success "✅ Subscription paused"
        return $result
    }
}

# Test 8: Resume Subscription
function Test-ResumeSubscription {
    param([int]$SubId = $global:SUBSCRIPTION_ID)
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 8: Resuming subscription..."
    
    $result = Invoke-ApiCall -Method PUT -Path "/subscriptions/$SubId/resume"
    
    if ($result -and $result.status -eq "active") {
        Write-Success "✅ Subscription resumed"
        return $result
    }
}

# Test 9: Get History
function Test-GetHistory {
    param([int]$SubId = $global:SUBSCRIPTION_ID)
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 9: Getting subscription history..."
    
    $result = Invoke-ApiCall -Method GET -Path "/subscriptions/$SubId/history"
    
    if ($result) {
        Write-Success "✅ History retrieved: $($result.Count) events"
        $actions = $result | ForEach-Object { $_.action }
        Write-Info "   Actions: $($actions -join ', ')"
        return $result
    }
}

# Test 10: Cancel Subscription
function Test-CancelSubscription {
    param([int]$SubId = $global:SUBSCRIPTION_ID)
    
    if (-not $SubId) {
        Write-Warning "No subscription ID. Run Test-CreateSubscription first."
        return
    }
    
    Write-Info "`n📝 TEST 10: Cancelling subscription..."
    
    $body = @{
        reason = "Testing cancellation"
        immediate = $false
    }
    
    $result = Invoke-ApiCall -Method DELETE -Path "/subscriptions/$SubId" -Body $body
    
    if ($result -and $result.cancelAtPeriodEnd) {
        Write-Success "✅ Cancellation scheduled"
        Write-Info "   Ends: $($result.currentPeriodEnd)"
        return $result
    }
}

# Run all tests in sequence
function Test-AllSequential {
    Write-Info "`n🧪 Running all E2E tests sequentially...`n"
    
    # Test sequence
    Test-CreateSubscription
    Start-Sleep -Seconds 1
    
    Test-GetSubscription
    Start-Sleep -Seconds 1
    
    Test-ApplyPromotion
    Start-Sleep -Seconds 1
    
    Test-ProcessPayment -Amount 14.995  # After 50% discount
    Start-Sleep -Seconds 2
    
    Test-UpgradePlan
    Start-Sleep -Seconds 2
    
    Test-PauseSubscription
    Start-Sleep -Seconds 1
    
    Test-ResumeSubscription
    Start-Sleep -Seconds 1
    
    Test-GetHistory
    Start-Sleep -Seconds 1
    
    Test-CancelSubscription
    
    Write-Success "`n✅ All tests completed!`n"
}

# Health check
function Test-HealthCheck {
    Write-Info "Checking API health..."
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/health" -Method GET
        Write-Success "✅ API is healthy"
        return $true
    }
    catch {
        Write-Error "❌ API is not responding"
        Write-Error "Make sure all services are running:"
        Write-Info "  npm run start:dev subscription-svc"
        Write-Info "  npm run start:dev api-gateway"
        return $false
    }
}

# Help menu
function Show-Help {
    Write-Host @"

📚 Quick E2E Test Commands
================================

Health Check:
  Test-HealthCheck

Individual Tests:
  Test-CreateSubscription
  Test-GetSubscription
  Test-ApplyPromotion
  Test-ProcessPayment
  Test-UpgradePlan
  Test-DowngradePlan
  Test-PauseSubscription
  Test-ResumeSubscription
  Test-GetHistory
  Test-CancelSubscription

Run All Tests:
  Test-AllSequential

Examples:
  Test-CreateSubscription
  Test-UpgradePlan -SubId 123 -NewPlanId 2
  Test-ApplyPromotion -Code "SAVE10"

Current Subscription ID: $global:SUBSCRIPTION_ID

"@
}

# Auto-run on load
Write-Host "`n🚀 E2E Test Script Loaded`n" -ForegroundColor Cyan
Write-Host "Type 'Show-Help' for available commands" -ForegroundColor Yellow
Write-Host "Type 'Test-AllSequential' to run all tests`n" -ForegroundColor Yellow

# Run health check
Test-HealthCheck
