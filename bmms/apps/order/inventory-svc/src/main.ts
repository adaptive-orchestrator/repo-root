import { NestFactory } from '@nestjs/core';
import { InventorySvcModule } from './inventory-svc.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(InventorySvcModule);
// ⭐ THÊM DÒNG NÀY
  console.log('⏳ Starting Kafka microservices...');
   app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'inventory-svc',
        brokers: process.env.KAFKA_BROKER?.split(',') || ['localhost:9092'],
      },
      consumer: {
        groupId: 'inventory-group',
        allowAutoTopicCreation: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3002);
   
  console.log('🚀 Billing Service is running on: http://localhost:3001');
  console.log('🎧 Kafka Consumer is listening...'); // Log để biết đã start
}
bootstrap();
