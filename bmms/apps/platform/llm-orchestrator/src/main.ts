import { NestFactory } from '@nestjs/core';
import { LlmOrchestratorModule } from './llm-orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create HTTP app first
  const httpApp = await NestFactory.create(LlmOrchestratorModule);
  httpApp.enableCors();
  
  // Get config
  const configService = httpApp.get(ConfigService);
  const grpcUrl = configService.get('GRPC_LISTEN_LLM_URL') || '0.0.0.0:50052';
  const httpPort = configService.get('LLM_ORCHESTRATOR_PORT') || 3001;

  // Add gRPC microservice to HTTP app
  httpApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'llm',
      protoPath: join(__dirname, './proto/llm-orchestrator.proto'),
      url: grpcUrl,
    },
  });

  // Start all microservices + HTTP
  await httpApp.startAllMicroservices();
  await httpApp.listen(httpPort);
  
  console.log(`🚀 LLM Orchestrator HTTP Server: http://localhost:${httpPort}`);
  console.log(`🚀 LLM Orchestrator gRPC Server: ${grpcUrl}`);
  console.log(`✅ Kafka producer ready (topic: k8s.deployment.requests)`);
  console.log(`📋 HTTP Endpoints:`);
  console.log(`   POST http://localhost:${httpPort}/llm/chat-and-deploy?dryRun=true`);
  console.log(`   GET  http://localhost:${httpPort}/rag/health`);
  console.log(`   POST http://localhost:${httpPort}/rag/search`);
}
bootstrap();
