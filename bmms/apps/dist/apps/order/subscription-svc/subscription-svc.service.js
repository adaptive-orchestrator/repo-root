"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.subscriptionSvcService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var rxjs_1 = require("rxjs");
var subscription_entity_1 = require("./entities/subscription.entity");
var event_1 = require("@bmms/event");
var event_2 = require("@bmms/event");
var subscriptionSvcService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var subscriptionSvcService = _classThis = /** @class */ (function () {
        function subscriptionSvcService_1(subscriptionRepo, historyRepo, kafka, catalogueClient, customerClient, prorationService) {
            this.subscriptionRepo = subscriptionRepo;
            this.historyRepo = historyRepo;
            this.kafka = kafka;
            this.catalogueClient = catalogueClient;
            this.customerClient = customerClient;
            this.prorationService = prorationService;
        }
        subscriptionSvcService_1.prototype.onModuleInit = function () {
            console.log('🔧 [SubscriptionSvcService] onModuleInit called');
            this.catalogueService = this.catalogueClient.getService('CatalogueService');
            this.customerService = this.customerClient.getService('CustomerService');
            console.log('✅ [SubscriptionSvcService] gRPC services initialized');
        };
        // ============= CRUD =============
        /**
         * Create a new subscription
         */
        subscriptionSvcService_1.prototype.create = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1, planResponse, error_2, plan, existingActive, now, currentPeriodStart, currentPeriodEnd, status, trialStart, trialEnd, isTrialUsed, subscription, baseEvent, trialEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('🔵 [SubscriptionSvc.create] START - dto:', JSON.stringify(dto));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.customerService.getCustomerById({ id: dto.customerId }))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            throw new common_1.NotFoundException("Customer ".concat(dto.customerId, " not found"));
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.catalogueService.getPlanById({ id: dto.planId }))];
                        case 5:
                            planResponse = _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_2 = _a.sent();
                            throw new common_1.NotFoundException("Plan ".concat(dto.planId, " not found"));
                        case 7:
                            plan = planResponse.plan;
                            console.log('✅ [SubscriptionSvc.create] Plan found:', plan.name);
                            return [4 /*yield*/, this.subscriptionRepo.findOne({
                                    where: {
                                        customerId: dto.customerId,
                                        status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                                    },
                                })];
                        case 8:
                            existingActive = _a.sent();
                            if (existingActive) {
                                throw new common_1.BadRequestException("Customer ".concat(dto.customerId, " already has an active subscription"));
                            }
                            now = new Date();
                            currentPeriodStart = now;
                            currentPeriodEnd = new Date(now);
                            if (plan.billingCycle === 'monthly') {
                                currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
                            }
                            else if (plan.billingCycle === 'yearly') {
                                currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
                            }
                            status = subscription_entity_1.SubscriptionStatus.ACTIVE;
                            isTrialUsed = false;
                            if (dto.useTrial && plan.trialEnabled && plan.trialDays > 0) {
                                status = subscription_entity_1.SubscriptionStatus.TRIAL;
                                trialStart = now;
                                trialEnd = new Date(now);
                                trialEnd.setDate(trialEnd.getDate() + plan.trialDays);
                                isTrialUsed = true;
                                console.log("\uD83C\uDF81 [SubscriptionSvc.create] Trial enabled for ".concat(plan.trialDays, " days"));
                            }
                            return [4 /*yield*/, this.subscriptionRepo.save(this.subscriptionRepo.create({
                                    customerId: dto.customerId,
                                    planId: dto.planId,
                                    planName: plan.name,
                                    amount: plan.price,
                                    billingCycle: plan.billingCycle,
                                    status: status,
                                    currentPeriodStart: currentPeriodStart,
                                    currentPeriodEnd: currentPeriodEnd,
                                    isTrialUsed: isTrialUsed,
                                    trialStart: trialStart,
                                    trialEnd: trialEnd,
                                    metadata: dto.metadata,
                                }))];
                        case 9:
                            subscription = _a.sent();
                            // 7. Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'created',
                                    newStatus: status,
                                    details: "Subscription created for plan ".concat(plan.name),
                                    metadata: { planId: dto.planId, useTrial: dto.useTrial },
                                }))];
                        case 10:
                            // 7. Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_CREATED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_CREATED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    planId: subscription.planId,
                                    planName: subscription.planName,
                                    status: subscription.status,
                                    currentPeriodStart: subscription.currentPeriodStart,
                                    currentPeriodEnd: subscription.currentPeriodEnd,
                                    trialEnd: subscription.trialEnd,
                                    amount: subscription.amount,
                                    billingCycle: subscription.billingCycle,
                                    createdAt: subscription.createdAt,
                                } }));
                            if (status === subscription_entity_1.SubscriptionStatus.TRIAL) {
                                trialEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_TRIAL_STARTED, 'subscription-svc');
                                this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_TRIAL_STARTED, __assign(__assign({}, trialEvent), { data: {
                                        subscriptionId: subscription.id,
                                        customerId: subscription.customerId,
                                        planId: subscription.planId,
                                        trialStart: subscription.trialStart,
                                        trialEnd: subscription.trialEnd,
                                        trialDays: plan.trialDays,
                                    } }));
                            }
                            console.log('✅ [SubscriptionSvc.create] Subscription created:', subscription.id);
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Get all subscriptions for a customer
         */
        subscriptionSvcService_1.prototype.listByCustomer = function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.subscriptionRepo.find({
                            where: { customerId: customerId },
                            order: { createdAt: 'DESC' },
                        })];
                });
            });
        };
        /**
         * Get subscription by ID
         */
        subscriptionSvcService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.subscriptionRepo.findOne({
                                where: { id: id },
                                relations: ['history'],
                            })];
                        case 1:
                            subscription = _a.sent();
                            if (!subscription) {
                                throw new common_1.NotFoundException("Subscription ".concat(id, " not found"));
                            }
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Cancel a subscription
         */
        subscriptionSvcService_1.prototype.cancel = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, previousStatus, baseEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            subscription = _a.sent();
                            if (subscription.isCancelled()) {
                                throw new common_1.BadRequestException('Subscription is already cancelled');
                            }
                            previousStatus = subscription.status;
                            if (dto.cancelAtPeriodEnd) {
                                subscription.cancelAtPeriodEnd = true;
                                subscription.cancellationReason = dto.reason;
                            }
                            else {
                                subscription.status = subscription_entity_1.SubscriptionStatus.CANCELLED;
                                subscription.cancelledAt = new Date();
                                subscription.cancellationReason = dto.reason;
                            }
                            return [4 /*yield*/, this.subscriptionRepo.save(subscription)];
                        case 2:
                            _a.sent();
                            // Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'cancelled',
                                    previousStatus: previousStatus,
                                    newStatus: subscription.status,
                                    details: dto.reason || 'Subscription cancelled by customer',
                                    metadata: { cancelAtPeriodEnd: dto.cancelAtPeriodEnd },
                                }))];
                        case 3:
                            // Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_CANCELLED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_CANCELLED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    planId: subscription.planId,
                                    cancelledAt: subscription.cancelledAt || new Date(),
                                    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
                                    reason: dto.reason,
                                } }));
                            console.log("\u2705 [SubscriptionSvc.cancel] Subscription ".concat(id, " cancelled"));
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Renew a subscription (called by scheduler or payment success event)
         */
        subscriptionSvcService_1.prototype.renew = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, previousPeriodEnd, baseEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            subscription = _a.sent();
                            if (!subscription.shouldBill()) {
                                throw new common_1.BadRequestException('Subscription cannot be renewed');
                            }
                            previousPeriodEnd = subscription.currentPeriodEnd;
                            subscription.currentPeriodStart = new Date(previousPeriodEnd);
                            subscription.currentPeriodEnd = new Date(previousPeriodEnd);
                            if (subscription.billingCycle === 'monthly') {
                                subscription.currentPeriodEnd.setMonth(subscription.currentPeriodEnd.getMonth() + 1);
                            }
                            else if (subscription.billingCycle === 'yearly') {
                                subscription.currentPeriodEnd.setFullYear(subscription.currentPeriodEnd.getFullYear() + 1);
                            }
                            // Convert from trial to active if needed
                            if (subscription.isOnTrial()) {
                                subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
                            }
                            return [4 /*yield*/, this.subscriptionRepo.save(subscription)];
                        case 2:
                            _a.sent();
                            // Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'renewed',
                                    newStatus: subscription.status,
                                    details: "Subscription renewed until ".concat(subscription.currentPeriodEnd.toISOString()),
                                }))];
                        case 3:
                            // Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_RENEWED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_RENEWED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    planId: subscription.planId,
                                    previousPeriodEnd: previousPeriodEnd,
                                    currentPeriodStart: subscription.currentPeriodStart,
                                    currentPeriodEnd: subscription.currentPeriodEnd,
                                    amount: subscription.amount,
                                    renewedAt: new Date(),
                                } }));
                            console.log("\u2705 [SubscriptionSvc.renew] Subscription ".concat(id, " renewed"));
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Change plan (upgrade/downgrade)
         */
        subscriptionSvcService_1.prototype.changePlan = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, planResponse, error_3, newPlan, previousPlanId, previousAmount, prorationResult, changeType, prorationDescription, baseEvent, invoiceEvent, creditEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            subscription = _a.sent();
                            if (!subscription.isActive()) {
                                throw new common_1.BadRequestException('Can only change plan for active subscriptions');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.catalogueService.getPlanById({ id: dto.newPlanId }))];
                        case 3:
                            planResponse = _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_3 = _a.sent();
                            throw new common_1.NotFoundException("Plan ".concat(dto.newPlanId, " not found"));
                        case 5:
                            newPlan = planResponse.plan;
                            previousPlanId = subscription.planId;
                            previousAmount = subscription.amount;
                            if (dto.immediate) {
                                prorationResult = this.prorationService.calculateImmediateChangeProration(previousAmount, newPlan.price, subscription.currentPeriodStart, subscription.currentPeriodEnd, new Date(), newPlan.billingCycle);
                            }
                            else {
                                prorationResult = this.prorationService.calculateProration(previousAmount, newPlan.price, subscription.currentPeriodStart, subscription.currentPeriodEnd, new Date(), newPlan.billingCycle);
                            }
                            changeType = this.prorationService.getChangeType(previousAmount, newPlan.price);
                            prorationDescription = this.prorationService.generateProrationDescription(prorationResult, changeType);
                            console.log("\uD83D\uDCCA [Proration] ".concat(changeType.toUpperCase(), ":"), {
                                oldAmount: previousAmount,
                                newAmount: newPlan.price,
                                creditAmount: prorationResult.creditAmount,
                                chargeAmount: prorationResult.chargeAmount,
                                netAmount: prorationResult.netAmount,
                                remainingDays: prorationResult.remainingDays,
                            });
                            // Update subscription
                            subscription.planId = dto.newPlanId;
                            subscription.planName = newPlan.name;
                            subscription.amount = newPlan.price;
                            subscription.billingCycle = newPlan.billingCycle;
                            if (dto.immediate) {
                                // Reset billing period for immediate change
                                subscription.currentPeriodStart = new Date();
                                subscription.currentPeriodEnd = prorationResult.nextBillingDate;
                            }
                            // Store proration details in metadata
                            subscription.metadata = __assign(__assign({}, subscription.metadata), { lastProration: {
                                    date: new Date(),
                                    changeType: changeType,
                                    oldAmount: previousAmount,
                                    newAmount: newPlan.price,
                                    creditAmount: prorationResult.creditAmount,
                                    netAmount: prorationResult.netAmount,
                                    description: prorationDescription,
                                } });
                            return [4 /*yield*/, this.subscriptionRepo.save(subscription)];
                        case 6:
                            _a.sent();
                            // Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'plan_changed',
                                    previousPlanId: previousPlanId,
                                    newPlanId: dto.newPlanId,
                                    details: "Plan ".concat(changeType, "d from ").concat(previousPlanId, " to ").concat(newPlan.name, ". ").concat(prorationDescription),
                                    metadata: {
                                        immediate: dto.immediate,
                                        changeType: changeType,
                                        proration: prorationResult,
                                    },
                                }))];
                        case 7:
                            // Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_PLAN_CHANGED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_PLAN_CHANGED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    previousPlanId: previousPlanId,
                                    newPlanId: dto.newPlanId,
                                    previousAmount: previousAmount,
                                    newAmount: newPlan.price,
                                    changeType: changeType,
                                    effectiveDate: dto.immediate ? new Date() : subscription.currentPeriodEnd,
                                    proration: prorationResult,
                                } }));
                            // If there's a net amount to charge/credit, emit billing event
                            if (this.prorationService.shouldApplyProration(prorationResult.netAmount)) {
                                if (prorationResult.netAmount > 0) {
                                    invoiceEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.INVOICE_CREATED, 'subscription-svc');
                                    this.kafka.emit(event_2.EventTopics.INVOICE_CREATED, __assign(__assign({}, invoiceEvent), { data: {
                                            customerId: subscription.customerId,
                                            subscriptionId: subscription.id,
                                            amount: prorationResult.netAmount,
                                            invoiceType: 'proration_charge',
                                            description: "Proration charge for plan upgrade: ".concat(prorationDescription),
                                            dueDate: new Date(),
                                            metadata: {
                                                changeType: 'upgrade',
                                                proration: prorationResult,
                                            },
                                        } }));
                                    console.log("\uD83D\uDCB0 [Proration] Invoice created for upgrade: $".concat(prorationResult.netAmount));
                                }
                                else if (prorationResult.netAmount < 0) {
                                    creditEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.BILLING_CREDIT_APPLIED, 'subscription-svc');
                                    this.kafka.emit(event_2.EventTopics.BILLING_CREDIT_APPLIED, __assign(__assign({}, creditEvent), { data: {
                                            customerId: subscription.customerId,
                                            subscriptionId: subscription.id,
                                            amount: Math.abs(prorationResult.netAmount),
                                            reason: "Proration credit for plan downgrade: ".concat(prorationDescription),
                                            metadata: {
                                                changeType: 'downgrade',
                                                proration: prorationResult,
                                            },
                                        } }));
                                    console.log("\uD83D\uDCB3 [Proration] Credit issued for downgrade: $".concat(Math.abs(prorationResult.netAmount)));
                                }
                            }
                            console.log("\u2705 [SubscriptionSvc.changePlan] Subscription ".concat(id, " plan changed to ").concat(newPlan.name));
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Update subscription status (used by event listeners)
         */
        subscriptionSvcService_1.prototype.updateStatus = function (id, newStatus, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, previousStatus, baseEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            subscription = _a.sent();
                            previousStatus = subscription.status;
                            subscription.status = newStatus;
                            return [4 /*yield*/, this.subscriptionRepo.save(subscription)];
                        case 2:
                            _a.sent();
                            // Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'status_changed',
                                    previousStatus: previousStatus,
                                    newStatus: newStatus,
                                    details: reason || "Status changed from ".concat(previousStatus, " to ").concat(newStatus),
                                }))];
                        case 3:
                            // Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_UPDATED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_UPDATED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    changes: { status: { from: previousStatus, to: newStatus } },
                                    previousStatus: previousStatus,
                                    newStatus: newStatus,
                                } }));
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        /**
         * Get subscriptions that need renewal (for scheduler)
         */
        subscriptionSvcService_1.prototype.findSubscriptionsToRenew = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, threeDaysFromNow;
                return __generator(this, function (_a) {
                    now = new Date();
                    threeDaysFromNow = new Date(now);
                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                    return [2 /*return*/, this.subscriptionRepo.find({
                            where: {
                                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
                                cancelAtPeriodEnd: false,
                                currentPeriodEnd: (0, typeorm_1.LessThanOrEqual)(threeDaysFromNow),
                            },
                        })];
                });
            });
        };
        /**
         * Convert trial to active (called when payment succeeds after trial)
         */
        subscriptionSvcService_1.prototype.convertTrialToActive = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var subscription, previousStatus, baseEvent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findById(id)];
                        case 1:
                            subscription = _a.sent();
                            if (!subscription.isOnTrial()) {
                                throw new common_1.BadRequestException('Subscription is not on trial');
                            }
                            previousStatus = subscription.status;
                            subscription.status = subscription_entity_1.SubscriptionStatus.ACTIVE;
                            return [4 /*yield*/, this.subscriptionRepo.save(subscription)];
                        case 2:
                            _a.sent();
                            // Save history
                            return [4 /*yield*/, this.historyRepo.save(this.historyRepo.create({
                                    subscriptionId: subscription.id,
                                    action: 'trial_ended',
                                    previousStatus: previousStatus,
                                    newStatus: subscription_entity_1.SubscriptionStatus.ACTIVE,
                                    details: 'Trial period ended, converted to active subscription',
                                }))];
                        case 3:
                            // Save history
                            _a.sent();
                            baseEvent = (0, event_1.createBaseEvent)(event_2.EventTopics.SUBSCRIPTION_TRIAL_ENDED, 'subscription-svc');
                            this.kafka.emit(event_2.EventTopics.SUBSCRIPTION_TRIAL_ENDED, __assign(__assign({}, baseEvent), { data: {
                                    subscriptionId: subscription.id,
                                    customerId: subscription.customerId,
                                    planId: subscription.planId,
                                    trialEnd: subscription.trialEnd,
                                    convertedToActive: true,
                                } }));
                            return [2 /*return*/, subscription];
                    }
                });
            });
        };
        return subscriptionSvcService_1;
    }());
    __setFunctionName(_classThis, "subscriptionSvcService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        subscriptionSvcService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return subscriptionSvcService = _classThis;
}();
exports.subscriptionSvcService = subscriptionSvcService;
