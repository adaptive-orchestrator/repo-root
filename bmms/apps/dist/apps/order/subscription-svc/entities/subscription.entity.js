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
exports.Subscription = exports.SubscriptionStatus = void 0;
var typeorm_1 = require("typeorm");
var subscription_history_entity_1 = require("./subscription-history.entity");
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["TRIAL"] = "trial";
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["EXPIRED"] = "expired";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var Subscription = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('subscriptions')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _customerId_decorators;
    var _customerId_initializers = [];
    var _customerId_extraInitializers = [];
    var _planId_decorators;
    var _planId_initializers = [];
    var _planId_extraInitializers = [];
    var _planName_decorators;
    var _planName_initializers = [];
    var _planName_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _billingCycle_decorators;
    var _billingCycle_initializers = [];
    var _billingCycle_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _currentPeriodStart_decorators;
    var _currentPeriodStart_initializers = [];
    var _currentPeriodStart_extraInitializers = [];
    var _currentPeriodEnd_decorators;
    var _currentPeriodEnd_initializers = [];
    var _currentPeriodEnd_extraInitializers = [];
    var _isTrialUsed_decorators;
    var _isTrialUsed_initializers = [];
    var _isTrialUsed_extraInitializers = [];
    var _trialStart_decorators;
    var _trialStart_initializers = [];
    var _trialStart_extraInitializers = [];
    var _trialEnd_decorators;
    var _trialEnd_initializers = [];
    var _trialEnd_extraInitializers = [];
    var _cancelAtPeriodEnd_decorators;
    var _cancelAtPeriodEnd_initializers = [];
    var _cancelAtPeriodEnd_extraInitializers = [];
    var _cancelledAt_decorators;
    var _cancelledAt_initializers = [];
    var _cancelledAt_extraInitializers = [];
    var _cancellationReason_decorators;
    var _cancellationReason_initializers = [];
    var _cancellationReason_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _history_decorators;
    var _history_initializers = [];
    var _history_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var Subscription = _classThis = /** @class */ (function () {
        function Subscription_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.customerId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.planId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
            this.planName = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
            this.amount = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.billingCycle = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _billingCycle_initializers, void 0));
            this.status = (__runInitializers(this, _billingCycle_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            // Billing period
            this.currentPeriodStart = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _currentPeriodStart_initializers, void 0));
            this.currentPeriodEnd = (__runInitializers(this, _currentPeriodStart_extraInitializers), __runInitializers(this, _currentPeriodEnd_initializers, void 0));
            // Trial information
            this.isTrialUsed = (__runInitializers(this, _currentPeriodEnd_extraInitializers), __runInitializers(this, _isTrialUsed_initializers, void 0));
            this.trialStart = (__runInitializers(this, _isTrialUsed_extraInitializers), __runInitializers(this, _trialStart_initializers, void 0));
            this.trialEnd = (__runInitializers(this, _trialStart_extraInitializers), __runInitializers(this, _trialEnd_initializers, void 0));
            // Cancellation
            this.cancelAtPeriodEnd = (__runInitializers(this, _trialEnd_extraInitializers), __runInitializers(this, _cancelAtPeriodEnd_initializers, void 0));
            this.cancelledAt = (__runInitializers(this, _cancelAtPeriodEnd_extraInitializers), __runInitializers(this, _cancelledAt_initializers, void 0));
            this.cancellationReason = (__runInitializers(this, _cancelledAt_extraInitializers), __runInitializers(this, _cancellationReason_initializers, void 0));
            // Metadata
            this.metadata = (__runInitializers(this, _cancellationReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.history = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _history_initializers, void 0));
            this.createdAt = (__runInitializers(this, _history_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        // Helper methods
        Subscription_1.prototype.isActive = function () {
            return this.status === SubscriptionStatus.ACTIVE;
        };
        Subscription_1.prototype.isOnTrial = function () {
            return this.status === SubscriptionStatus.TRIAL;
        };
        Subscription_1.prototype.isCancelled = function () {
            return this.status === SubscriptionStatus.CANCELLED;
        };
        Subscription_1.prototype.isExpired = function () {
            return this.status === SubscriptionStatus.EXPIRED;
        };
        Subscription_1.prototype.shouldBill = function () {
            return ((this.status === SubscriptionStatus.ACTIVE ||
                this.status === SubscriptionStatus.PAST_DUE) &&
                !this.cancelAtPeriodEnd);
        };
        Subscription_1.prototype.getDaysUntilRenewal = function () {
            var now = new Date();
            var end = new Date(this.currentPeriodEnd);
            var diffTime = end.getTime() - now.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };
        return Subscription_1;
    }());
    __setFunctionName(_classThis, "Subscription");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _customerId_decorators = [(0, typeorm_1.Column)()];
        _planId_decorators = [(0, typeorm_1.Column)()];
        _planName_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _amount_decorators = [(0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 })];
        _billingCycle_decorators = [(0, typeorm_1.Column)()];
        _status_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: SubscriptionStatus,
                default: SubscriptionStatus.ACTIVE,
            })];
        _currentPeriodStart_decorators = [(0, typeorm_1.Column)()];
        _currentPeriodEnd_decorators = [(0, typeorm_1.Column)()];
        _isTrialUsed_decorators = [(0, typeorm_1.Column)({ default: false })];
        _trialStart_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _trialEnd_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _cancelAtPeriodEnd_decorators = [(0, typeorm_1.Column)({ default: false })];
        _cancelledAt_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _cancellationReason_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _metadata_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _history_decorators = [(0, typeorm_1.OneToMany)(function () { return subscription_history_entity_1.SubscriptionHistory; }, function (history) { return history.subscription; }, {
                cascade: true,
            })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: function (obj) { return "customerId" in obj; }, get: function (obj) { return obj.customerId; }, set: function (obj, value) { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: function (obj) { return "planId" in obj; }, get: function (obj) { return obj.planId; }, set: function (obj, value) { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
        __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: function (obj) { return "planName" in obj; }, get: function (obj) { return obj.planName; }, set: function (obj, value) { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _billingCycle_decorators, { kind: "field", name: "billingCycle", static: false, private: false, access: { has: function (obj) { return "billingCycle" in obj; }, get: function (obj) { return obj.billingCycle; }, set: function (obj, value) { obj.billingCycle = value; } }, metadata: _metadata }, _billingCycle_initializers, _billingCycle_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _currentPeriodStart_decorators, { kind: "field", name: "currentPeriodStart", static: false, private: false, access: { has: function (obj) { return "currentPeriodStart" in obj; }, get: function (obj) { return obj.currentPeriodStart; }, set: function (obj, value) { obj.currentPeriodStart = value; } }, metadata: _metadata }, _currentPeriodStart_initializers, _currentPeriodStart_extraInitializers);
        __esDecorate(null, null, _currentPeriodEnd_decorators, { kind: "field", name: "currentPeriodEnd", static: false, private: false, access: { has: function (obj) { return "currentPeriodEnd" in obj; }, get: function (obj) { return obj.currentPeriodEnd; }, set: function (obj, value) { obj.currentPeriodEnd = value; } }, metadata: _metadata }, _currentPeriodEnd_initializers, _currentPeriodEnd_extraInitializers);
        __esDecorate(null, null, _isTrialUsed_decorators, { kind: "field", name: "isTrialUsed", static: false, private: false, access: { has: function (obj) { return "isTrialUsed" in obj; }, get: function (obj) { return obj.isTrialUsed; }, set: function (obj, value) { obj.isTrialUsed = value; } }, metadata: _metadata }, _isTrialUsed_initializers, _isTrialUsed_extraInitializers);
        __esDecorate(null, null, _trialStart_decorators, { kind: "field", name: "trialStart", static: false, private: false, access: { has: function (obj) { return "trialStart" in obj; }, get: function (obj) { return obj.trialStart; }, set: function (obj, value) { obj.trialStart = value; } }, metadata: _metadata }, _trialStart_initializers, _trialStart_extraInitializers);
        __esDecorate(null, null, _trialEnd_decorators, { kind: "field", name: "trialEnd", static: false, private: false, access: { has: function (obj) { return "trialEnd" in obj; }, get: function (obj) { return obj.trialEnd; }, set: function (obj, value) { obj.trialEnd = value; } }, metadata: _metadata }, _trialEnd_initializers, _trialEnd_extraInitializers);
        __esDecorate(null, null, _cancelAtPeriodEnd_decorators, { kind: "field", name: "cancelAtPeriodEnd", static: false, private: false, access: { has: function (obj) { return "cancelAtPeriodEnd" in obj; }, get: function (obj) { return obj.cancelAtPeriodEnd; }, set: function (obj, value) { obj.cancelAtPeriodEnd = value; } }, metadata: _metadata }, _cancelAtPeriodEnd_initializers, _cancelAtPeriodEnd_extraInitializers);
        __esDecorate(null, null, _cancelledAt_decorators, { kind: "field", name: "cancelledAt", static: false, private: false, access: { has: function (obj) { return "cancelledAt" in obj; }, get: function (obj) { return obj.cancelledAt; }, set: function (obj, value) { obj.cancelledAt = value; } }, metadata: _metadata }, _cancelledAt_initializers, _cancelledAt_extraInitializers);
        __esDecorate(null, null, _cancellationReason_decorators, { kind: "field", name: "cancellationReason", static: false, private: false, access: { has: function (obj) { return "cancellationReason" in obj; }, get: function (obj) { return obj.cancellationReason; }, set: function (obj, value) { obj.cancellationReason = value; } }, metadata: _metadata }, _cancellationReason_initializers, _cancellationReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _history_decorators, { kind: "field", name: "history", static: false, private: false, access: { has: function (obj) { return "history" in obj; }, get: function (obj) { return obj.history; }, set: function (obj, value) { obj.history = value; } }, metadata: _metadata }, _history_initializers, _history_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Subscription = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Subscription = _classThis;
}();
exports.Subscription = Subscription;
