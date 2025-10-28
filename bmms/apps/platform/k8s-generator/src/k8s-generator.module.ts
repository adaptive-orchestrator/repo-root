import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { K8sGeneratorController } from './k8s-generator.controller';
import { K8sGeneratorService } from './k8s-generator.service';
import { K8sClientService } from './services/k8s-client.service';
import { TemplateService } from './services/template.service';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { EventModule } from '../../../../libs/event/src/event.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Kafka Event Module
    EventModule.forRoot({
      clientId: 'k8s-generator',
      consumerGroupId: 'k8s-generator-group',
    }),
  ],
  controllers: [K8sGeneratorController, KafkaConsumerService],
  providers: [K8sGeneratorService, TemplateService, K8sClientService],
  exports: [K8sGeneratorService],
})
export class K8sGeneratorModule {}
