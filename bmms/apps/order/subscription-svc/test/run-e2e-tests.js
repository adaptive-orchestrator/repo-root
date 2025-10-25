#!/usr/bin/env node

/**
 * E2E Test Runner for Subscription Flow
 * 
 * This script runs automated E2E tests against running services
 * 
 * Usage:
 *   node run-e2e-tests.js
 *   node run-e2e-tests.js --verbose
 *   node run-e2e-tests.js --test=1  # Run specific test only
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';
const VERBOSE = process.argv.includes('--verbose');
const SPECIFIC_TEST = process.argv.find(arg => arg.startsWith('--test='))?.split('=')[1];

// Test state
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: [],
};

let subscriptionId = null;
const customerId = 1;
const basicPlanId = 1;
const proPlanId = 2;
const promotionCode = 'TEST50';

// Helper functions
function log(message, color = '') {
  const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
  };
  console.log(`${colors[color] || ''}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiRequest(method, path, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${path}`,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

function recordTest(testName, passed, error = null) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    logSuccess(`Test passed: ${testName}`);
  } else {
    testResults.failed++;
    logError(`Test failed: ${testName}`);
    if (error) {
      logError(`  Error: ${JSON.stringify(error)}`);
      testResults.errors.push({ test: testName, error });
    }
  }
}

// Test cases
async function test1_CreateSubscriptionWithTrial() {
  log('\n📝 TEST 1: Create Subscription with Trial', 'cyan');
  
  const createDto = {
    customerId,
    planId: basicPlanId,
    billingCycle: 'monthly',
    useTrial: true,
  };
  
  const result = await apiRequest('POST', '/subscriptions', createDto);
  
  if (!result.success) {
    recordTest('Create subscription with trial', false, result.error);
    return false;
  }
  
  const sub = result.data;
  subscriptionId = sub.id;
  
  const checks = [
    { name: 'Has ID', condition: sub.id > 0 },
    { name: 'Status is trial', condition: sub.status === 'trial' },
    { name: 'Customer ID matches', condition: sub.customerId === customerId },
    { name: 'Plan ID matches', condition: sub.planId === basicPlanId },
    { name: 'Trial is used', condition: sub.isTrialUsed === true },
    { name: 'Has trial start date', condition: !!sub.trialStart },
    { name: 'Has trial end date', condition: !!sub.trialEnd },
  ];
  
  const allPassed = checks.every(check => {
    if (VERBOSE) {
      log(`  ${check.condition ? '✓' : '✗'} ${check.name}`, check.condition ? 'green' : 'red');
    }
    return check.condition;
  });
  
  if (allPassed) {
    logInfo(`  Subscription created: ID=${subscriptionId}`);
  }
  
  recordTest('Create subscription with trial', allPassed);
  return allPassed;
}

async function test2_GetSubscriptionDetails() {
  log('\n📝 TEST 2: Get Subscription Details', 'cyan');
  
  if (!subscriptionId) {
    recordTest('Get subscription details', false, 'No subscription ID from previous test');
    return false;
  }
  
  const result = await apiRequest('GET', `/subscriptions/${subscriptionId}`);
  
  if (!result.success) {
    recordTest('Get subscription details', false, result.error);
    return false;
  }
  
  const passed = result.data.id === subscriptionId;
  recordTest('Get subscription details', passed);
  return passed;
}

async function test3_ApplyPromotionCode() {
  log('\n📝 TEST 3: Apply Promotion Code', 'cyan');
  
  const applyDto = {
    code: promotionCode,
    subscriptionId,
    customerId,
  };
  
  const result = await apiRequest('POST', '/promotions/apply', applyDto);
  
  if (!result.success) {
    recordTest('Apply promotion code', false, result.error);
    return false;
  }
  
  const passed = result.data.code === promotionCode && result.data.discount > 0;
  
  if (passed && VERBOSE) {
    logInfo(`  Discount applied: ${result.data.discount}%`);
  }
  
  recordTest('Apply promotion code', passed);
  return passed;
}

async function test4_ConvertTrialToActive() {
  log('\n📝 TEST 4: Convert Trial to Active (Payment)', 'cyan');
  
  const paymentDto = {
    subscriptionId,
    amount: 29.99,
    paymentMethod: 'credit_card',
  };
  
  const result = await apiRequest('POST', '/payments/process', paymentDto);
  
  if (!result.success) {
    recordTest('Process payment', false, result.error);
    return false;
  }
  
  // Wait for event processing
  await sleep(2000);
  
  // Check subscription status
  const statusResult = await apiRequest('GET', `/subscriptions/${subscriptionId}`);
  
  const passed = statusResult.success && statusResult.data.status === 'active';
  recordTest('Convert trial to active', passed);
  return passed;
}

async function test5_UpgradePlanWithProration() {
  log('\n📝 TEST 5: Upgrade Plan with Proration', 'cyan');
  
  const changePlanDto = {
    newPlanId: proPlanId,
    immediate: true,
  };
  
  const result = await apiRequest('PUT', `/subscriptions/${subscriptionId}/change-plan`, changePlanDto);
  
  if (!result.success) {
    recordTest('Upgrade plan with proration', false, result.error);
    return false;
  }
  
  const checks = [
    { name: 'Plan ID updated', condition: result.data.planId === proPlanId },
    { name: 'Has proration data', condition: !!result.data.metadata?.lastProration },
    { name: 'Change type is upgrade', condition: result.data.metadata?.lastProration?.changeType === 'upgrade' },
    { name: 'Net amount is positive', condition: result.data.metadata?.lastProration?.netAmount > 0 },
  ];
  
  const allPassed = checks.every(check => {
    if (VERBOSE) {
      log(`  ${check.condition ? '✓' : '✗'} ${check.name}`, check.condition ? 'green' : 'red');
    }
    return check.condition;
  });
  
  if (allPassed && VERBOSE) {
    const proration = result.data.metadata.lastProration;
    logInfo(`  Proration charge: $${proration.netAmount}`);
  }
  
  recordTest('Upgrade plan with proration', allPassed);
  return allPassed;
}

async function test6_PauseSubscription() {
  log('\n📝 TEST 6: Pause Subscription', 'cyan');
  
  const pauseDto = {
    reason: 'E2E test pause',
  };
  
  const result = await apiRequest('PUT', `/subscriptions/${subscriptionId}/pause`, pauseDto);
  
  if (!result.success) {
    recordTest('Pause subscription', false, result.error);
    return false;
  }
  
  const passed = result.data.status === 'paused';
  recordTest('Pause subscription', passed);
  return passed;
}

async function test7_ResumeSubscription() {
  log('\n📝 TEST 7: Resume Subscription', 'cyan');
  
  const result = await apiRequest('PUT', `/subscriptions/${subscriptionId}/resume`);
  
  if (!result.success) {
    recordTest('Resume subscription', false, result.error);
    return false;
  }
  
  const passed = result.data.status === 'active';
  recordTest('Resume subscription', passed);
  return passed;
}

async function test8_GetSubscriptionHistory() {
  log('\n📝 TEST 8: Get Subscription History', 'cyan');
  
  const result = await apiRequest('GET', `/subscriptions/${subscriptionId}/history`);
  
  if (!result.success) {
    recordTest('Get subscription history', false, result.error);
    return false;
  }
  
  const history = result.data;
  const passed = Array.isArray(history) && history.length > 0;
  
  if (passed && VERBOSE) {
    logInfo(`  History records: ${history.length}`);
    const actions = history.map(h => h.action);
    logInfo(`  Actions: ${actions.join(', ')}`);
  }
  
  recordTest('Get subscription history', passed);
  return passed;
}

async function test9_CancelSubscription() {
  log('\n📝 TEST 9: Cancel Subscription', 'cyan');
  
  const cancelDto = {
    reason: 'E2E test cancellation',
    immediate: false,
  };
  
  const result = await apiRequest('DELETE', `/subscriptions/${subscriptionId}`, cancelDto);
  
  if (!result.success) {
    recordTest('Cancel subscription', false, result.error);
    return false;
  }
  
  const passed = result.data.cancelAtPeriodEnd === true;
  recordTest('Cancel subscription', passed);
  return passed;
}

// Main test runner
async function runAllTests() {
  log('\n🧪 Starting E2E Tests for Subscription Flow\n', 'cyan');
  log(`API Base URL: ${API_BASE_URL}\n`);
  
  // Check if services are running
  logInfo('Checking if services are running...');
  const healthCheck = await apiRequest('GET', '/health').catch(() => ({ success: false }));
  
  if (!healthCheck.success) {
    logError('API Gateway is not responding!');
    logError('Please start all services before running tests.');
    process.exit(1);
  }
  
  logSuccess('Services are running\n');
  
  const tests = [
    { id: 1, fn: test1_CreateSubscriptionWithTrial, name: 'Create subscription with trial' },
    { id: 2, fn: test2_GetSubscriptionDetails, name: 'Get subscription details' },
    { id: 3, fn: test3_ApplyPromotionCode, name: 'Apply promotion code' },
    { id: 4, fn: test4_ConvertTrialToActive, name: 'Convert trial to active' },
    { id: 5, fn: test5_UpgradePlanWithProration, name: 'Upgrade plan with proration' },
    { id: 6, fn: test6_PauseSubscription, name: 'Pause subscription' },
    { id: 7, fn: test7_ResumeSubscription, name: 'Resume subscription' },
    { id: 8, fn: test8_GetSubscriptionHistory, name: 'Get subscription history' },
    { id: 9, fn: test9_CancelSubscription, name: 'Cancel subscription' },
  ];
  
  // Run tests
  for (const test of tests) {
    if (SPECIFIC_TEST && test.id !== parseInt(SPECIFIC_TEST)) {
      continue;
    }
    
    try {
      await test.fn();
    } catch (error) {
      logError(`Unexpected error in test: ${test.name}`);
      logError(error.message);
      recordTest(test.name, false, error.message);
    }
    
    // Small delay between tests
    await sleep(500);
  }
  
  // Print summary
  log('\n' + '='.repeat(60), 'cyan');
  log('TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Total tests: ${testResults.total}`);
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  
  if (testResults.errors.length > 0) {
    log('\nFailed Tests:', 'red');
    testResults.errors.forEach((err, idx) => {
      log(`${idx + 1}. ${err.test}`, 'red');
      if (VERBOSE) {
        log(`   ${JSON.stringify(err.error, null, 2)}`, 'red');
      }
    });
  }
  
  log('='.repeat(60) + '\n', 'cyan');
  
  if (testResults.failed === 0) {
    logSuccess('🎉 All tests passed!');
    process.exit(0);
  } else {
    logError('❌ Some tests failed');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  logError('Fatal error running tests:');
  console.error(error);
  process.exit(1);
});
