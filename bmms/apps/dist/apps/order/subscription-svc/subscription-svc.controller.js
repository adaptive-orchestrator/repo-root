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
exports.subscriptionSvcController = void 0;
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var subscriptionSvcController = function () {
    var _classDecorators = [(0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createSubscription_decorators;
    var _getSubscriptionById_decorators;
    var _getSubscriptionsByCustomer_decorators;
    var _cancelSubscription_decorators;
    var _renewSubscription_decorators;
    var _changePlan_decorators;
    var _updateSubscriptionStatus_decorators;
    var subscriptionSvcController = _classThis = /** @class */ (function () {
        function subscriptionSvcController_1(subscriptionSvcService) {
            this.subscriptionSvcService = (__runInitializers(this, _instanceExtraInitializers), subscriptionSvcService);
        }
        subscriptionSvcController_1.prototype.createSubscription = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var dto, subscription, error_1;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            dto = {
                                customerId: data.customerId,
                                planId: data.planId,
                                promotionCode: data.promotionCode,
                                useTrial: data.useTrial,
                            };
                            return [4 /*yield*/, this.subscriptionSvcService.create(dto)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Subscription created successfully',
                                }];
                        case 2:
                            error_1 = _h.sent();
                            console.error('❌ [gRPC CreateSubscription] Error:', error_1);
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.getSubscriptionById = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, error_2;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.subscriptionSvcService.findById(data.id)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Subscription found',
                                }];
                        case 2:
                            error_2 = _h.sent();
                            console.error('❌ [gRPC GetSubscriptionById] Error:', error_2);
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.getSubscriptionsByCustomer = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var subscriptions, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.subscriptionSvcService.listByCustomer(data.customerId)];
                        case 1:
                            subscriptions = _a.sent();
                            return [2 /*return*/, {
                                    subscriptions: subscriptions.map(function (sub) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        return ({
                                            id: sub.id,
                                            customerId: sub.customerId,
                                            planId: sub.planId,
                                            planName: sub.planName,
                                            amount: sub.amount,
                                            billingCycle: sub.billingCycle,
                                            status: sub.status,
                                            currentPeriodStart: (_a = sub.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                            currentPeriodEnd: (_b = sub.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                            isTrialUsed: sub.isTrialUsed,
                                            trialStart: ((_c = sub.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                            trialEnd: ((_d = sub.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
                                            cancelledAt: ((_e = sub.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                            cancellationReason: sub.cancellationReason || '',
                                            createdAt: (_f = sub.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                            updatedAt: (_g = sub.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                        });
                                    }),
                                }];
                        case 2:
                            error_3 = _a.sent();
                            console.error('❌ [gRPC GetSubscriptionsByCustomer] Error:', error_3);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.cancelSubscription = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var dto, subscription, error_4;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            dto = {
                                reason: data.reason,
                                cancelAtPeriodEnd: data.cancelAtPeriodEnd,
                            };
                            return [4 /*yield*/, this.subscriptionSvcService.cancel(data.id, dto)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Subscription cancelled successfully',
                                }];
                        case 2:
                            error_4 = _h.sent();
                            console.error('❌ [gRPC CancelSubscription] Error:', error_4);
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.renewSubscription = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, error_5;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.subscriptionSvcService.renew(data.id)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Subscription renewed successfully',
                                }];
                        case 2:
                            error_5 = _h.sent();
                            console.error('❌ [gRPC RenewSubscription] Error:', error_5);
                            throw error_5;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.changePlan = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var dto, subscription, error_6;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            dto = {
                                newPlanId: data.newPlanId,
                                immediate: data.immediate,
                            };
                            return [4 /*yield*/, this.subscriptionSvcService.changePlan(data.id, dto)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Plan changed successfully',
                                }];
                        case 2:
                            error_6 = _h.sent();
                            console.error('❌ [gRPC ChangePlan] Error:', error_6);
                            throw error_6;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        subscriptionSvcController_1.prototype.updateSubscriptionStatus = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, error_7;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            _h.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.subscriptionSvcService.updateStatus(data.id, data.newStatus, data.reason)];
                        case 1:
                            subscription = _h.sent();
                            return [2 /*return*/, {
                                    subscription: {
                                        id: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        planName: subscription.planName,
                                        amount: subscription.amount,
                                        billingCycle: subscription.billingCycle,
                                        status: subscription.status,
                                        currentPeriodStart: (_a = subscription.currentPeriodStart) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        currentPeriodEnd: (_b = subscription.currentPeriodEnd) === null || _b === void 0 ? void 0 : _b.toISOString(),
                                        isTrialUsed: subscription.isTrialUsed,
                                        trialStart: ((_c = subscription.trialStart) === null || _c === void 0 ? void 0 : _c.toISOString()) || '',
                                        trialEnd: ((_d = subscription.trialEnd) === null || _d === void 0 ? void 0 : _d.toISOString()) || '',
                                        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                        cancelledAt: ((_e = subscription.cancelledAt) === null || _e === void 0 ? void 0 : _e.toISOString()) || '',
                                        cancellationReason: subscription.cancellationReason || '',
                                        createdAt: (_f = subscription.createdAt) === null || _f === void 0 ? void 0 : _f.toISOString(),
                                        updatedAt: (_g = subscription.updatedAt) === null || _g === void 0 ? void 0 : _g.toISOString(),
                                    },
                                    message: 'Subscription status updated successfully',
                                }];
                        case 2:
                            error_7 = _h.sent();
                            console.error('❌ [gRPC UpdateSubscriptionStatus] Error:', error_7);
                            throw error_7;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return subscriptionSvcController_1;
    }());
    __setFunctionName(_classThis, "subscriptionSvcController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createSubscription_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'CreateSubscription')];
        _getSubscriptionById_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'GetSubscriptionById')];
        _getSubscriptionsByCustomer_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'GetSubscriptionsByCustomer')];
        _cancelSubscription_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'CancelSubscription')];
        _renewSubscription_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'RenewSubscription')];
        _changePlan_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'ChangePlan')];
        _updateSubscriptionStatus_decorators = [(0, microservices_1.GrpcMethod)('SubscriptionService', 'UpdateSubscriptionStatus')];
        __esDecorate(_classThis, null, _createSubscription_decorators, { kind: "method", name: "createSubscription", static: false, private: false, access: { has: function (obj) { return "createSubscription" in obj; }, get: function (obj) { return obj.createSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscriptionById_decorators, { kind: "method", name: "getSubscriptionById", static: false, private: false, access: { has: function (obj) { return "getSubscriptionById" in obj; }, get: function (obj) { return obj.getSubscriptionById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscriptionsByCustomer_decorators, { kind: "method", name: "getSubscriptionsByCustomer", static: false, private: false, access: { has: function (obj) { return "getSubscriptionsByCustomer" in obj; }, get: function (obj) { return obj.getSubscriptionsByCustomer; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelSubscription_decorators, { kind: "method", name: "cancelSubscription", static: false, private: false, access: { has: function (obj) { return "cancelSubscription" in obj; }, get: function (obj) { return obj.cancelSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _renewSubscription_decorators, { kind: "method", name: "renewSubscription", static: false, private: false, access: { has: function (obj) { return "renewSubscription" in obj; }, get: function (obj) { return obj.renewSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changePlan_decorators, { kind: "method", name: "changePlan", static: false, private: false, access: { has: function (obj) { return "changePlan" in obj; }, get: function (obj) { return obj.changePlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSubscriptionStatus_decorators, { kind: "method", name: "updateSubscriptionStatus", static: false, private: false, access: { has: function (obj) { return "updateSubscriptionStatus" in obj; }, get: function (obj) { return obj.updateSubscriptionStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        subscriptionSvcController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return subscriptionSvcController = _classThis;
}();
exports.subscriptionSvcController = subscriptionSvcController;
