import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export interface K8sDeploymentEvent {
  eventId: string;
  timestamp: string;
  proposal_text: string;
  changeset: {
    model: string;
    features: Array<{ key: string; value: string }>;
    impacted_services: string[];
  };
  metadata: any;
  replicas?: number;
  version?: string;
  dryRun?: boolean;
}

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly topic = 'k8s.deployment.requests';

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log(`✅ Kafka producer connected (topic: ${this.topic})`);
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
    this.logger.log('Kafka producer disconnected');
  }

  /**
   * Publish K8s deployment event to Kafka
   */
  async publishDeploymentEvent(event: K8sDeploymentEvent): Promise<void> {
    try {
      await this.kafkaClient.emit(this.topic, event).toPromise();

      this.logger.log(`📤 Published deployment event: ${event.eventId} for ${event.changeset.impacted_services.length} services`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to publish event: ${error.message}`);
      throw error;
    }
  }
}
