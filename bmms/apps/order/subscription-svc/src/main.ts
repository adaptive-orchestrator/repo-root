import { NestFactory } from '@nestjs/core';
import { subscriptionSvcModule } from './subscription-svc.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(subscriptionSvcModule);
  const configService = appContext.get(ConfigService);
  
  const grpcUrl = configService.get<string>('GRPC_LISTEN_SUBSCRIPTION_URL') || '0.0.0.0:50059';
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(subscriptionSvcModule, {
    transport: Transport.GRPC,
    options: {
      package: 'subscription',
      protoPath: join(__dirname, './proto/subscription.proto'),
      url: grpcUrl,
    },
  });

  await app.listen();
  console.log(`🚀 Subscription Service is listening on gRPC: ${grpcUrl}`);
}

bootstrap();
