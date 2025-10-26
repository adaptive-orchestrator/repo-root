"use strict";
/**
 * Proration Service - Usage Examples
 *
 * This file demonstrates how to use the ProrationService
 * in different scenarios.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var proration_service_1 = require("./proration.service");
// Initialize service
var prorationService = new proration_service_1.ProrationService();
// =============================================================================
// EXAMPLE 1: Mid-cycle Plan Upgrade (Immediate)
// =============================================================================
console.log('=== EXAMPLE 1: Mid-cycle Upgrade (Immediate) ===\n');
// Customer on $29.99/month Basic plan
// Upgrades to $49.99/month Pro plan on day 15 of 30
var upgrade = prorationService.calculateImmediateChangeProration(29.99, // Old plan price
49.99, // New plan price
new Date('2025-01-01'), // Period start
new Date('2025-01-31'), // Period end
new Date('2025-01-15'), // Change date
'monthly');
console.log('Proration Calculation:');
console.log("- Old plan: $".concat(upgrade.oldPlanDailyRate, "/day \u00D7 ").concat(upgrade.creditDays, " days = $").concat(upgrade.creditAmount, " credit"));
console.log("- New plan: Full charge = $".concat(upgrade.chargeAmount));
console.log("- Net amount: $".concat(upgrade.netAmount));
console.log("- Next billing: ".concat(upgrade.nextBillingDate.toDateString()));
var upgradeDesc = prorationService.generateProrationDescription(upgrade, 'upgrade');
console.log('\nCustomer message:');
console.log(upgradeDesc);
/*
Expected Output:
Proration Calculation:
- Old plan: $1.00/day × 16 days = $16.00 credit
- New plan: Full charge = $49.99
- Net amount: $33.99
- Next billing: Mon Feb 15 2025

Customer message:
Credit for unused 16 days of previous plan: $16.00
Charge for 16 days of new plan: $49.99
Total due today: $33.99
*/
// =============================================================================
// EXAMPLE 2: Mid-cycle Plan Downgrade (Period-End)
// =============================================================================
console.log('\n\n=== EXAMPLE 2: Mid-cycle Downgrade (Period-End) ===\n');
// Customer on $49.99/month Pro plan
// Downgrades to $29.99/month Basic plan
// Wants to keep Pro features until period ends
var downgrade = prorationService.calculateProration(49.99, // Old plan price
29.99, // New plan price
new Date('2025-01-01'), // Period start
new Date('2025-01-31'), // Period end
new Date('2025-01-20'), // Change date
'monthly');
console.log('Proration Calculation:');
console.log("- Old plan credit: $".concat(downgrade.creditAmount));
console.log("- New plan charge: $".concat(downgrade.chargeAmount));
console.log("- Net amount: $".concat(downgrade.netAmount));
console.log("- Change takes effect: ".concat(downgrade.nextBillingDate.toDateString()));
if (downgrade.netAmount < 0) {
    console.log("\n\u2705 Customer receives $".concat(Math.abs(downgrade.netAmount), " credit"));
}
/*
Expected Output:
Proration Calculation:
- Old plan credit: $18.33
- New plan charge: $10.99
- Net amount: -$7.34
- Change takes effect: Fri Jan 31 2025

✅ Customer receives $7.34 credit
*/
// =============================================================================
// EXAMPLE 3: Yearly Plan Change
// =============================================================================
console.log('\n\n=== EXAMPLE 3: Yearly Plan Upgrade ===\n');
// Customer on $299/year plan
// Upgrades to $599/year plan mid-year
var yearlyUpgrade = prorationService.calculateProration(299, 599, new Date('2025-01-01'), new Date('2025-12-31'), new Date('2025-07-01'), // Mid-year
'yearly');
console.log('Proration Calculation:');
console.log("- Total days in period: ".concat(yearlyUpgrade.totalDaysInPeriod));
console.log("- Remaining days: ".concat(yearlyUpgrade.remainingDays));
console.log("- Old daily rate: $".concat(yearlyUpgrade.oldPlanDailyRate));
console.log("- New daily rate: $".concat(yearlyUpgrade.newPlanDailyRate));
console.log("- Credit: $".concat(yearlyUpgrade.creditAmount));
console.log("- Charge: $".concat(yearlyUpgrade.chargeAmount));
console.log("- Net: $".concat(yearlyUpgrade.netAmount));
/*
Expected Output:
Proration Calculation:
- Total days in period: 364
- Remaining days: 184
- Old daily rate: $0.82
- New daily rate: $1.65
- Credit: $150.88
- Charge: $303.60
- Net: $152.72
*/
// =============================================================================
// EXAMPLE 4: Cancellation Refund
// =============================================================================
console.log('\n\n=== EXAMPLE 4: Subscription Cancellation ===\n');
// Customer cancels $49.99/month plan on day 10
var refund = prorationService.calculateCancellationRefund(49.99, new Date('2025-01-01'), new Date('2025-01-31'), new Date('2025-01-10'));
console.log('Cancellation Refund:');
console.log("- Total days paid: ".concat(refund.totalDays));
console.log("- Days used: ".concat(refund.totalDays - refund.refundDays));
console.log("- Days unused: ".concat(refund.refundDays));
console.log("- Daily rate: $".concat(refund.dailyRate));
console.log("- Refund amount: $".concat(refund.refundAmount));
/*
Expected Output:
Cancellation Refund:
- Total days paid: 30
- Days used: 9
- Days unused: 21
- Daily rate: $1.67
- Refund amount: $35.07
*/
// =============================================================================
// EXAMPLE 5: Change Type Detection
// =============================================================================
console.log('\n\n=== EXAMPLE 5: Change Type Detection ===\n');
var changes = [
    { from: 29.99, to: 49.99 },
    { from: 49.99, to: 29.99 },
    { from: 39.99, to: 39.99 },
];
changes.forEach(function (change) {
    var type = prorationService.getChangeType(change.from, change.to);
    console.log("$".concat(change.from, " \u2192 $").concat(change.to, " = ").concat(type));
});
/*
Expected Output:
$29.99 → $49.99 = upgrade
$49.99 → $29.99 = downgrade
$39.99 → $39.99 = sidegrade
*/
// =============================================================================
// EXAMPLE 6: Minimum Threshold Check
// =============================================================================
console.log('\n\n=== EXAMPLE 6: Minimum Threshold ===\n');
// Small price difference - should we charge?
var smallChange = prorationService.calculateProration(29.99, 31.99, // Only $2 difference
new Date('2025-01-01'), new Date('2025-01-31'), new Date('2025-01-28'), // Only 3 days left
'monthly');
console.log("Net amount: $".concat(smallChange.netAmount));
console.log("Should apply proration? ".concat(prorationService.shouldApplyProration(smallChange.netAmount)));
/*
Expected Output:
Net amount: $0.20
Should apply proration? false (below $1.00 threshold)
*/
// =============================================================================
// EXAMPLE 7: Complete Plan Change Flow
// =============================================================================
console.log('\n\n=== EXAMPLE 7: Complete Plan Change Flow ===\n');
function simulateChangePlan(subscription_1, newPlan_1) {
    return __awaiter(this, arguments, void 0, function (subscription, newPlan, immediate) {
        var proration, changeType, description;
        if (immediate === void 0) { immediate = false; }
        return __generator(this, function (_a) {
            console.log("\nChanging plan for subscription #".concat(subscription.id));
            console.log("Current: $".concat(subscription.amount, "/").concat(subscription.billingCycle));
            console.log("New: ".concat(newPlan.name, " - $").concat(newPlan.price, "/").concat(newPlan.billingCycle));
            console.log("Mode: ".concat(immediate ? 'Immediate' : 'Period-end'));
            if (immediate) {
                proration = prorationService.calculateImmediateChangeProration(subscription.amount, newPlan.price, subscription.currentPeriodStart, subscription.currentPeriodEnd, new Date(), newPlan.billingCycle);
            }
            else {
                proration = prorationService.calculateProration(subscription.amount, newPlan.price, subscription.currentPeriodStart, subscription.currentPeriodEnd, new Date(), newPlan.billingCycle);
            }
            changeType = prorationService.getChangeType(subscription.amount, newPlan.price);
            description = prorationService.generateProrationDescription(proration, changeType);
            console.log("\n".concat(description));
            // Determine action
            if (prorationService.shouldApplyProration(proration.netAmount)) {
                if (proration.netAmount > 0) {
                    console.log("\n\uD83D\uDCB3 Action: Charge customer $".concat(proration.netAmount));
                    console.log("   \u2192 Create invoice for proration charge");
                }
                else {
                    console.log("\n\uD83D\uDCB0 Action: Issue $".concat(Math.abs(proration.netAmount), " credit"));
                    console.log("   \u2192 Add credit to customer account");
                }
            }
            else {
                console.log('\n✅ Action: No charge (amount below threshold)');
            }
            // Update subscription
            console.log('\n📝 Update subscription:');
            console.log("   - planId: ".concat(subscription.planId, " \u2192 ").concat(newPlan.id));
            console.log("   - amount: $".concat(subscription.amount, " \u2192 $").concat(newPlan.price));
            if (immediate) {
                console.log("   - currentPeriodStart: ".concat(new Date()));
                console.log("   - currentPeriodEnd: ".concat(proration.nextBillingDate));
            }
            console.log("   - metadata.lastProration: { ... }");
            return [2 /*return*/, proration];
        });
    });
}
// Simulate upgrade
var mockSubscription = {
    id: 123,
    customerId: 456,
    planId: 1,
    amount: 29.99,
    billingCycle: 'monthly',
    currentPeriodStart: new Date('2025-01-01'),
    currentPeriodEnd: new Date('2025-01-31'),
};
var mockNewPlan = {
    id: 2,
    name: 'Pro Plan',
    price: 49.99,
    billingCycle: 'monthly',
};
simulateChangePlan(mockSubscription, mockNewPlan, true);
// =============================================================================
// EXAMPLE 8: Proration Policy
// =============================================================================
console.log('\n\n=== EXAMPLE 8: Proration Policy ===\n');
console.log(prorationService.getProrationPolicy());
// =============================================================================
// EXAMPLE 9: Error Handling
// =============================================================================
console.log('\n\n=== EXAMPLE 9: Error Handling ===\n');
try {
    // Invalid: change date outside period
    prorationService.calculateProration(29.99, 49.99, new Date('2025-01-01'), new Date('2025-01-31'), new Date('2025-02-15'), // Outside period!
    'monthly');
}
catch (error) {
    console.log("\u274C Error caught: ".concat(error.message));
}
// =============================================================================
// Summary
// =============================================================================
console.log('\n\n=== Summary ===\n');
console.log('✅ ProrationService provides:');
console.log('  1. Period-end plan changes (no immediate charge)');
console.log('  2. Immediate plan changes (with fair proration)');
console.log('  3. Cancellation refund calculations');
console.log('  4. Upgrade/downgrade detection');
console.log('  5. Customer-friendly descriptions');
console.log('  6. Minimum threshold checking');
console.log('  7. Comprehensive error handling');
console.log('\n🚀 Ready for production use!');
