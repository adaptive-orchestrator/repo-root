
import { NestFactory } from '@nestjs/core';
import { OrderSvcModule } from './order-svc.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // Create hybrid application (HTTP + gRPC + Kafka)
  const app = await NestFactory.create(OrderSvcModule);

  // 1. Connect gRPC microservice
  console.log('⏳ Starting gRPC microservice...');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: process.env.GRPC_SERVER_ORDER_URL || '127.0.0.1:50057',
      package: 'order',
      protoPath: join(__dirname, './proto/order.proto'),
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  });

  // 2. Connect Kafka microservice
  console.log('⏳ Starting Kafka microservice...');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'order-svc',
        brokers: process.env.KAFKA_BROKER?.split(',') || ['localhost:9092'],
      },
      consumer: {
        groupId: 'order-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT || 3011;
  await app.listen(port);
  
  console.log(`✅ Order Service (HTTP) running on port ${port}`);
  console.log('✅ Order Service (gRPC) listening on port 50057');
  console.log('✅ Kafka Consumer listening for events');
}
bootstrap();