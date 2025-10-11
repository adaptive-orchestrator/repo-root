
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderSvcModule } from './order-svc.module';

async function bootstrap() {
  // Tạo HTTP app
  const app = await NestFactory.create(OrderSvcModule);

  // Thêm Kafka microservice để lắng nghe events
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
  await app.listen(3011);
  console.log('✅ Order Service running on port 3011');
  console.log('✅ Kafka Consumer listening for events');
}
bootstrap();