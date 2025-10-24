import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthModule } from './resources/auth/auth.module';
import { LlmOrchestratorModule } from './resources/llm-orchestrator/llm-orchestrator.module';
import { CatalogueModule } from './resources/catalogue/catalogue.module';
import { InventoryModule } from './resources/inventory/inventory.module';
import { CustomerModule } from './resources/customer/customer.module';
import { OrderModule } from './resources/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    CustomerModule,
    LlmOrchestratorModule,
    CatalogueModule,
    InventoryModule,
    OrderModule,
  ],
  controllers: [
    ApiGatewayController,
    // KHÔNG cần thêm AuthController và LlmOrchestratorController ở đây
    // vì chúng đã được declare trong AuthModule và LlmOrchestratorModule
  ],
  providers: [
    ApiGatewayService,
    // KHÔNG cần thêm LlmOrchestratorService ở đây
    // vì nó đã được declare trong LlmOrchestratorModule
  ],
})
export class ApiGatewayModule {}