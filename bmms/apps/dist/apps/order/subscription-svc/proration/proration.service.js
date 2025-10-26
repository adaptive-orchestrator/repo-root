"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProrationService = void 0;
var common_1 = require("@nestjs/common");
/**
 * Proration Service
 * Handles proration calculations for plan changes
 */
var ProrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProrationService = _classThis = /** @class */ (function () {
        function ProrationService_1() {
        }
        /**
         * Calculate proration for plan change
         *
         * @param oldAmount - Current plan amount
         * @param newAmount - New plan amount
         * @param currentPeriodStart - Start of current billing period
         * @param currentPeriodEnd - End of current billing period
         * @param changeDate - Date of plan change (default: now)
         * @param billingCycle - Billing cycle (monthly or yearly)
         * @returns ProrationResult with detailed calculations
         */
        ProrationService_1.prototype.calculateProration = function (oldAmount, newAmount, currentPeriodStart, currentPeriodEnd, changeDate, billingCycle) {
            if (changeDate === void 0) { changeDate = new Date(); }
            if (billingCycle === void 0) { billingCycle = 'monthly'; }
            // Ensure dates are Date objects
            var periodStart = new Date(currentPeriodStart);
            var periodEnd = new Date(currentPeriodEnd);
            var effectiveDate = new Date(changeDate);
            // Validate dates
            if (effectiveDate < periodStart || effectiveDate > periodEnd) {
                throw new Error('Change date must be within current billing period');
            }
            // Calculate total days in billing period
            var totalDaysInPeriod = this.getDaysDifference(periodStart, periodEnd);
            // Calculate remaining days from change date to period end
            var remainingDays = this.getDaysDifference(effectiveDate, periodEnd);
            // Calculate daily rates
            var oldPlanDailyRate = oldAmount / totalDaysInPeriod;
            var newPlanDailyRate = newAmount / totalDaysInPeriod;
            // Calculate credit (unused portion of old plan)
            var creditDays = remainingDays;
            var creditAmount = oldPlanDailyRate * creditDays;
            // Calculate charge (new plan for remaining days)
            var chargeDays = remainingDays;
            var chargeAmount = newPlanDailyRate * chargeDays;
            // Calculate net amount
            // Positive = customer owes money (upgrade)
            // Negative = customer gets credit (downgrade)
            var netAmount = chargeAmount - creditAmount;
            return {
                creditAmount: this.roundToTwoDecimals(creditAmount),
                creditDays: creditDays,
                chargeAmount: this.roundToTwoDecimals(chargeAmount),
                chargeDays: chargeDays,
                netAmount: this.roundToTwoDecimals(netAmount),
                oldPlanDailyRate: this.roundToTwoDecimals(oldPlanDailyRate),
                newPlanDailyRate: this.roundToTwoDecimals(newPlanDailyRate),
                remainingDays: remainingDays,
                totalDaysInPeriod: totalDaysInPeriod,
                effectiveDate: effectiveDate,
                nextBillingDate: periodEnd,
            };
        };
        /**
         * Calculate proration for immediate plan change
         * Starts a new billing period immediately
         *
         * @param oldAmount - Current plan amount
         * @param newAmount - New plan amount
         * @param currentPeriodStart - Start of current billing period
         * @param currentPeriodEnd - End of current billing period
         * @param changeDate - Date of plan change
         * @param billingCycle - Billing cycle
         * @returns ProrationResult
         */
        ProrationService_1.prototype.calculateImmediateChangeProration = function (oldAmount, newAmount, currentPeriodStart, currentPeriodEnd, changeDate, billingCycle) {
            if (changeDate === void 0) { changeDate = new Date(); }
            if (billingCycle === void 0) { billingCycle = 'monthly'; }
            var periodStart = new Date(currentPeriodStart);
            var periodEnd = new Date(currentPeriodEnd);
            var effectiveDate = new Date(changeDate);
            // Calculate total days in billing period
            var totalDaysInPeriod = this.getDaysDifference(periodStart, periodEnd);
            // Calculate remaining days from change date to period end
            var remainingDays = this.getDaysDifference(effectiveDate, periodEnd);
            // Calculate daily rate of old plan
            var oldPlanDailyRate = oldAmount / totalDaysInPeriod;
            // Credit for unused portion of old plan
            var creditAmount = oldPlanDailyRate * remainingDays;
            // Charge full amount for new plan (starts new period)
            var chargeAmount = newAmount;
            // Net amount (customer pays new plan minus credit)
            var netAmount = chargeAmount - creditAmount;
            // Calculate new billing period end
            var nextBillingDate = new Date(effectiveDate);
            if (billingCycle === 'monthly') {
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            }
            else {
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
            }
            return {
                creditAmount: this.roundToTwoDecimals(creditAmount),
                creditDays: remainingDays,
                chargeAmount: this.roundToTwoDecimals(chargeAmount),
                chargeDays: billingCycle === 'monthly' ? 30 : 365, // Approximate
                netAmount: this.roundToTwoDecimals(netAmount),
                oldPlanDailyRate: this.roundToTwoDecimals(oldPlanDailyRate),
                newPlanDailyRate: this.roundToTwoDecimals(newAmount / (billingCycle === 'monthly' ? 30 : 365)),
                remainingDays: remainingDays,
                totalDaysInPeriod: totalDaysInPeriod,
                effectiveDate: effectiveDate,
                nextBillingDate: nextBillingDate,
            };
        };
        /**
         * Determine if plan change is upgrade or downgrade
         */
        ProrationService_1.prototype.getChangeType = function (oldAmount, newAmount) {
            if (newAmount > oldAmount) {
                return 'upgrade';
            }
            else if (newAmount < oldAmount) {
                return 'downgrade';
            }
            return 'sidegrade';
        };
        /**
         * Generate proration description for customer
         */
        ProrationService_1.prototype.generateProrationDescription = function (proration, changeType) {
            var parts = [];
            if (proration.creditAmount > 0) {
                parts.push("Credit for unused ".concat(proration.creditDays, " days of previous plan: $").concat(proration.creditAmount.toFixed(2)));
            }
            parts.push("Charge for ".concat(proration.chargeDays, " days of new plan: $").concat(proration.chargeAmount.toFixed(2)));
            if (proration.netAmount > 0) {
                parts.push("\nTotal due today: $".concat(proration.netAmount.toFixed(2)));
            }
            else if (proration.netAmount < 0) {
                parts.push("\nCredit applied: $".concat(Math.abs(proration.netAmount).toFixed(2)));
            }
            else {
                parts.push('\nNo additional charge');
            }
            return parts.join('\n');
        };
        /**
         * Check if proration should be applied
         * Some businesses skip proration for small amounts
         */
        ProrationService_1.prototype.shouldApplyProration = function (netAmount, threshold) {
            if (threshold === void 0) { threshold = 1.0; }
            return Math.abs(netAmount) >= threshold;
        };
        /**
         * Calculate refund amount for cancellation
         * Returns unused portion of current period
         */
        ProrationService_1.prototype.calculateCancellationRefund = function (amount, currentPeriodStart, currentPeriodEnd, cancellationDate) {
            if (cancellationDate === void 0) { cancellationDate = new Date(); }
            var periodStart = new Date(currentPeriodStart);
            var periodEnd = new Date(currentPeriodEnd);
            var cancelDate = new Date(cancellationDate);
            var totalDays = this.getDaysDifference(periodStart, periodEnd);
            var refundDays = this.getDaysDifference(cancelDate, periodEnd);
            var dailyRate = amount / totalDays;
            var refundAmount = dailyRate * refundDays;
            return {
                refundAmount: this.roundToTwoDecimals(refundAmount),
                refundDays: refundDays,
                totalDays: totalDays,
                dailyRate: this.roundToTwoDecimals(dailyRate),
            };
        };
        /**
         * Helper: Calculate days difference between two dates
         */
        ProrationService_1.prototype.getDaysDifference = function (startDate, endDate) {
            var start = new Date(startDate);
            var end = new Date(endDate);
            var diffTime = end.getTime() - start.getTime();
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        };
        /**
         * Helper: Round to 2 decimal places
         */
        ProrationService_1.prototype.roundToTwoDecimals = function (value) {
            return Math.round(value * 100) / 100;
        };
        /**
         * Get proration policy description
         */
        ProrationService_1.prototype.getProrationPolicy = function () {
            return "\nProration Policy:\n- Plan upgrades: You'll be charged the prorated difference for the remaining period\n- Plan downgrades: Credit will be applied to your account for unused time\n- Immediate changes: New plan starts immediately with credit for unused time\n- Period-end changes: New plan starts at the end of current billing period\n- Cancellations: Unused time may be refunded based on policy\n    ".trim();
        };
        return ProrationService_1;
    }());
    __setFunctionName(_classThis, "ProrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProrationService = _classThis;
}();
exports.ProrationService = ProrationService;
