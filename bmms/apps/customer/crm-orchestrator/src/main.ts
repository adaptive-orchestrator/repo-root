import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { crmOrchestratorModule } from './crm-orchestrator.module';

// Load .env from bmms root directory
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function bootstrap() {
  const configService = new ConfigService();
  
  // Create hybrid application
  const app = await NestFactory.create(crmOrchestratorModule);

  // Connect Kafka for event listening
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'crm-orchestrator',
        brokers: (configService.get('KAFKA_BROKER') || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: 'crm-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.startAllMicroservices();
  
  const port = configService.get('CRM_ORCHESTRATOR_PORT') || 3005;
  await app.listen(port);
  
  console.log(`✅ CRM Orchestrator running on http://localhost:${port}`);
  console.log('✅ CRM Orchestrator (Kafka) listening for events');
}
bootstrap();

