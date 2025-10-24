import { NestFactory } from '@nestjs/core';
import { InventorySvcModule } from './inventory-svc.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(InventorySvcModule);
  const configService = appContext.get(ConfigService);

  const grpcUrl = configService.get<string>('GRPC_LISTEN_INVENTORY_URL');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(InventorySvcModule, {
    transport: Transport.GRPC,
    options: {
      package: 'inventory',
      protoPath: join(__dirname, './proto/inventory.proto'),
      url: grpcUrl,
    },
  });

  await app.listen();
  console.log(`🚀 Inventory gRPC Service is running on ${grpcUrl}`);
}
bootstrap();
