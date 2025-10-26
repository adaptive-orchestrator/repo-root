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
exports.SubscriptionHistory = void 0;
var typeorm_1 = require("typeorm");
var subscription_entity_1 = require("./subscription.entity");
var SubscriptionHistory = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('subscription_history')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _subscriptionId_decorators;
    var _subscriptionId_initializers = [];
    var _subscriptionId_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _previousStatus_decorators;
    var _previousStatus_initializers = [];
    var _previousStatus_extraInitializers = [];
    var _newStatus_decorators;
    var _newStatus_initializers = [];
    var _newStatus_extraInitializers = [];
    var _previousPlanId_decorators;
    var _previousPlanId_initializers = [];
    var _previousPlanId_extraInitializers = [];
    var _newPlanId_decorators;
    var _newPlanId_initializers = [];
    var _newPlanId_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _subscription_decorators;
    var _subscription_initializers = [];
    var _subscription_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var SubscriptionHistory = _classThis = /** @class */ (function () {
        function SubscriptionHistory_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.subscriptionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
            this.action = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _action_initializers, void 0)); // 'created', 'renewed', 'cancelled', 'status_changed', 'plan_changed', etc.
            this.previousStatus = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _previousStatus_initializers, void 0));
            this.newStatus = (__runInitializers(this, _previousStatus_extraInitializers), __runInitializers(this, _newStatus_initializers, void 0));
            this.previousPlanId = (__runInitializers(this, _newStatus_extraInitializers), __runInitializers(this, _previousPlanId_initializers, void 0));
            this.newPlanId = (__runInitializers(this, _previousPlanId_extraInitializers), __runInitializers(this, _newPlanId_initializers, void 0));
            this.details = (__runInitializers(this, _newPlanId_extraInitializers), __runInitializers(this, _details_initializers, void 0));
            this.metadata = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.subscription = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _subscription_initializers, void 0));
            this.createdAt = (__runInitializers(this, _subscription_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return SubscriptionHistory_1;
    }());
    __setFunctionName(_classThis, "SubscriptionHistory");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _subscriptionId_decorators = [(0, typeorm_1.Column)()];
        _action_decorators = [(0, typeorm_1.Column)()];
        _previousStatus_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _newStatus_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _previousPlanId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _newPlanId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _details_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _metadata_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _subscription_decorators = [(0, typeorm_1.ManyToOne)(function () { return subscription_entity_1.Subscription; }, function (subscription) { return subscription.history; }), (0, typeorm_1.JoinColumn)({ name: 'subscriptionId' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: function (obj) { return "subscriptionId" in obj; }, get: function (obj) { return obj.subscriptionId; }, set: function (obj, value) { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _previousStatus_decorators, { kind: "field", name: "previousStatus", static: false, private: false, access: { has: function (obj) { return "previousStatus" in obj; }, get: function (obj) { return obj.previousStatus; }, set: function (obj, value) { obj.previousStatus = value; } }, metadata: _metadata }, _previousStatus_initializers, _previousStatus_extraInitializers);
        __esDecorate(null, null, _newStatus_decorators, { kind: "field", name: "newStatus", static: false, private: false, access: { has: function (obj) { return "newStatus" in obj; }, get: function (obj) { return obj.newStatus; }, set: function (obj, value) { obj.newStatus = value; } }, metadata: _metadata }, _newStatus_initializers, _newStatus_extraInitializers);
        __esDecorate(null, null, _previousPlanId_decorators, { kind: "field", name: "previousPlanId", static: false, private: false, access: { has: function (obj) { return "previousPlanId" in obj; }, get: function (obj) { return obj.previousPlanId; }, set: function (obj, value) { obj.previousPlanId = value; } }, metadata: _metadata }, _previousPlanId_initializers, _previousPlanId_extraInitializers);
        __esDecorate(null, null, _newPlanId_decorators, { kind: "field", name: "newPlanId", static: false, private: false, access: { has: function (obj) { return "newPlanId" in obj; }, get: function (obj) { return obj.newPlanId; }, set: function (obj, value) { obj.newPlanId = value; } }, metadata: _metadata }, _newPlanId_initializers, _newPlanId_extraInitializers);
        __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _subscription_decorators, { kind: "field", name: "subscription", static: false, private: false, access: { has: function (obj) { return "subscription" in obj; }, get: function (obj) { return obj.subscription; }, set: function (obj, value) { obj.subscription = value; } }, metadata: _metadata }, _subscription_initializers, _subscription_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionHistory = _classThis;
}();
exports.SubscriptionHistory = SubscriptionHistory;
