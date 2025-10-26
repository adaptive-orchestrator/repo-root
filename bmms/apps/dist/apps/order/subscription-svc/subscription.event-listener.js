"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionEventListener = void 0;
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var event = require("@bmms/event");
var SubscriptionEventListener = function () {
    var _classDecorators = [(0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handlePaymentSuccess_decorators;
    var _handlePaymentFailed_decorators;
    var _handleInvoiceCreated_decorators;
    var SubscriptionEventListener = _classThis = /** @class */ (function () {
        function SubscriptionEventListener_1(subscriptionService) {
            this.subscriptionService = (__runInitializers(this, _instanceExtraInitializers), subscriptionService);
        }
        /** -------- Payment Events -------- */
        SubscriptionEventListener_1.prototype.handlePaymentSuccess = function (eventData) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, invoiceId, customerId;
                return __generator(this, function (_b) {
                    try {
                        console.log('📥 [subscription-group] Received PAYMENT_SUCCESS event');
                        this.logEvent(eventData);
                        _a = eventData.data, invoiceId = _a.invoiceId, customerId = _a.customerId;
                        // Get invoice to check if it's for a subscription
                        // In a real scenario, you'd query billing service or use the invoice metadata
                        console.log("\uD83D\uDCB3 Payment succeeded for invoice ".concat(invoiceId));
                        // TODO: If invoice is for a subscription trial ending, convert trial to active
                        // This would require getting invoice details and checking subscriptionId
                    }
                    catch (error) {
                        console.error('❌ Error handling PAYMENT_SUCCESS:', error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        SubscriptionEventListener_1.prototype.handlePaymentFailed = function (eventData) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, invoiceId, customerId, reason;
                return __generator(this, function (_b) {
                    try {
                        console.log('📥 [subscription-group] Received PAYMENT_FAILED event');
                        this.logEvent(eventData);
                        _a = eventData.data, invoiceId = _a.invoiceId, customerId = _a.customerId, reason = _a.reason;
                        console.log("\u274C Payment failed for invoice ".concat(invoiceId, ": ").concat(reason));
                        // TODO: If this is a subscription payment, mark subscription as past_due
                        // This would require getting invoice details and checking subscriptionId
                        // const invoice = await getInvoiceDetails(invoiceId);
                        // if (invoice.subscriptionId) {
                        //   await this.subscriptionService.updateStatus(
                        //     invoice.subscriptionId,
                        //     SubscriptionStatus.PAST_DUE,
                        //     `Payment failed: ${reason}`
                        //   );
                        // }
                    }
                    catch (error) {
                        console.error('❌ Error handling PAYMENT_FAILED:', error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        SubscriptionEventListener_1.prototype.handleInvoiceCreated = function (eventData) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, invoiceId, invoiceNumber, customerId;
                return __generator(this, function (_b) {
                    try {
                        console.log('📥 [subscription-group] Received INVOICE_CREATED event');
                        this.logEvent(eventData);
                        _a = eventData.data, invoiceId = _a.invoiceId, invoiceNumber = _a.invoiceNumber, customerId = _a.customerId;
                        console.log("\uD83D\uDCC4 Invoice ".concat(invoiceNumber, " created for customer ").concat(customerId));
                        // TODO: Send notification to customer about new invoice
                    }
                    catch (error) {
                        console.error('❌ Error handling INVOICE_CREATED:', error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        /** -------- Scheduled Jobs / Cron Events -------- */
        /**
         * This would be called by a scheduler service to check for expiring trials
         */
        SubscriptionEventListener_1.prototype.checkExpiringTrials = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        console.log('🔍 Checking for expiring trials...');
                        // Find subscriptions on trial that are expiring soon (e.g., 3 days before end)
                        // Send notifications to customers
                    }
                    catch (error) {
                        console.error('❌ Error checking expiring trials:', error);
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * This would be called by a scheduler service to check for subscription renewals
         */
        SubscriptionEventListener_1.prototype.checkSubscriptionRenewals = function () {
            return __awaiter(this, void 0, void 0, function () {
                var subscriptions, _i, subscriptions_1, subscription, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            console.log('🔍 Checking for subscriptions to renew...');
                            return [4 /*yield*/, this.subscriptionService.findSubscriptionsToRenew()];
                        case 1:
                            subscriptions = _a.sent();
                            console.log("Found ".concat(subscriptions.length, " subscriptions to renew"));
                            _i = 0, subscriptions_1 = subscriptions;
                            _a.label = 2;
                        case 2:
                            if (!(_i < subscriptions_1.length)) return [3 /*break*/, 5];
                            subscription = subscriptions_1[_i];
                            console.log("\uD83D\uDD04 Renewing subscription ".concat(subscription.id));
                            return [4 /*yield*/, this.subscriptionService.renew(subscription.id)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            console.error('❌ Error checking subscription renewals:', error_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /** -------- Helper Methods -------- */
        SubscriptionEventListener_1.prototype.logEvent = function (eventData) {
            var timestamp = typeof eventData.timestamp === 'string'
                ? new Date(eventData.timestamp).toISOString()
                : eventData.timestamp.toISOString();
            console.log("\uD83D\uDD25 [SUBSCRIPTION] Received event [".concat(eventData.eventType, "] at ").concat(timestamp));
        };
        return SubscriptionEventListener_1;
    }());
    __setFunctionName(_classThis, "SubscriptionEventListener");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handlePaymentSuccess_decorators = [(0, microservices_1.EventPattern)(event.EventTopics.PAYMENT_SUCCESS)];
        _handlePaymentFailed_decorators = [(0, microservices_1.EventPattern)(event.EventTopics.PAYMENT_FAILED)];
        _handleInvoiceCreated_decorators = [(0, microservices_1.EventPattern)(event.EventTopics.INVOICE_CREATED)];
        __esDecorate(_classThis, null, _handlePaymentSuccess_decorators, { kind: "method", name: "handlePaymentSuccess", static: false, private: false, access: { has: function (obj) { return "handlePaymentSuccess" in obj; }, get: function (obj) { return obj.handlePaymentSuccess; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handlePaymentFailed_decorators, { kind: "method", name: "handlePaymentFailed", static: false, private: false, access: { has: function (obj) { return "handlePaymentFailed" in obj; }, get: function (obj) { return obj.handlePaymentFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleInvoiceCreated_decorators, { kind: "method", name: "handleInvoiceCreated", static: false, private: false, access: { has: function (obj) { return "handleInvoiceCreated" in obj; }, get: function (obj) { return obj.handleInvoiceCreated; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionEventListener = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionEventListener = _classThis;
}();
exports.SubscriptionEventListener = SubscriptionEventListener;
