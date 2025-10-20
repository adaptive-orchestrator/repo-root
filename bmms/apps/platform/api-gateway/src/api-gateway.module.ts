import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthController } from './resources/auth/auth.controller';
import { AuthModule } from './resources/auth/auth.module';

@Module({
  imports: [AuthModule,],
  controllers: [ApiGatewayController,AuthController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
