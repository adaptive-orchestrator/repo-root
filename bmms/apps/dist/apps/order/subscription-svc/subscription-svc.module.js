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
exports.subscriptionSvcModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var microservices_1 = require("@nestjs/microservices");
var typeorm_1 = require("@nestjs/typeorm");
var db_1 = require("@bmms/db");
var event_1 = require("@bmms/event");
var subscription_svc_controller_1 = require("./subscription-svc.controller");
var subscription_svc_service_1 = require("./subscription-svc.service");
var subscription_event_listener_1 = require("./subscription.event-listener");
var subscription_entity_1 = require("./entities/subscription.entity");
var subscription_history_entity_1 = require("./entities/subscription-history.entity");
var proration_service_1 = require("./proration/proration.service");
var subscriptionSvcModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                }),
                typeorm_1.TypeOrmModule.forFeature([subscription_entity_1.Subscription, subscription_history_entity_1.SubscriptionHistory]),
                db_1.DbModule.forRoot({ prefix: 'SUBSCRIPTION_SVC' }),
                event_1.EventModule.forRoot({
                    clientId: 'subscription-svc',
                    consumerGroupId: 'subscription-group',
                }),
                // gRPC clients
                microservices_1.ClientsModule.register([
                    {
                        name: 'CUSTOMER_PACKAGE',
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: 'customer',
                            protoPath: './apps/customer/customer-svc/src/proto/customer.proto',
                            url: process.env.GRPC_SERVER_CUSTOMER_URL || '127.0.0.1:50052',
                        },
                    },
                    {
                        name: 'CATALOGUE_PACKAGE',
                        transport: microservices_1.Transport.GRPC,
                        options: {
                            package: 'catalogue',
                            protoPath: './apps/product/catalogue-svc/src/proto/catalogue.proto',
                            url: process.env.GRPC_SERVER_CATALOGUE_URL || '127.0.0.1:50055',
                        },
                    },
                ]),
            ],
            controllers: [subscription_svc_controller_1.subscriptionSvcController, subscription_event_listener_1.SubscriptionEventListener],
            providers: [subscription_svc_service_1.subscriptionSvcService, proration_service_1.ProrationService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var subscriptionSvcModule = _classThis = /** @class */ (function () {
        function subscriptionSvcModule_1() {
        }
        return subscriptionSvcModule_1;
    }());
    __setFunctionName(_classThis, "subscriptionSvcModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        subscriptionSvcModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return subscriptionSvcModule = _classThis;
}();
exports.subscriptionSvcModule = subscriptionSvcModule;
