import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';
import { randomUUID } from 'crypto';

@Injectable()
export class K8sIntegrationService {
  private readonly logger = new Logger(K8sIntegrationService.name);
  private readonly k8sGeneratorUrl: string;
  private readonly autoDeployEnabled: boolean;
  private readonly useKafka: boolean;

  constructor(
    private configService: ConfigService,
    private kafkaProducer: KafkaProducerService,
  ) {
    this.k8sGeneratorUrl = this.configService.get<string>(
      'K8S_GENERATOR_URL',
      'http://localhost:3020',
    );
    this.autoDeployEnabled = this.configService.get<boolean>(
      'AUTO_DEPLOY_ENABLED',
      false,
    );
    this.useKafka = this.configService.get<boolean>(
      'USE_KAFKA_FOR_K8S',
      true, // Default: use Kafka
    );
  }

  /**
   * Gửi changeset từ LLM sang K8s Generator để auto-deploy
   * @param changeset - LLM output
   * @param dryRun - If true, only generate YAML files without applying to cluster
   */
  async triggerDeployment(changeset: any, dryRun = false): Promise<any> {
    if (!this.autoDeployEnabled && !dryRun) {
      this.logger.log('⚠️  Auto-deploy is disabled');
      return { deployed: false, reason: 'Auto-deploy disabled' };
    }

    // Use Kafka for async deployment
    if (this.useKafka) {
      return this.triggerDeploymentViaKafka(changeset, dryRun);
    }
    
    // Fallback to HTTP (for testing)
    return this.triggerDeploymentViaHttp(changeset, dryRun);
  }

  /**
   * Trigger deployment via Kafka event (Async, event-driven)
   */
  private async triggerDeploymentViaKafka(changeset: any, dryRun = false): Promise<any> {
    try {
      const mode = dryRun ? 'DRY-RUN (YAML only)' : 'DEPLOY';
      this.logger.log(
        `🚀 [${mode}] Publishing K8s deployment event for services: ${changeset.changeset.impacted_services.join(', ')}`,
      );

      const eventId = randomUUID();
      
      await this.kafkaProducer.publishDeploymentEvent({
        eventId,
        timestamp: new Date().toISOString(),
        proposal_text: changeset.proposal_text,
        changeset: changeset.changeset,
        metadata: changeset.metadata,
        replicas: 1,
        version: 'latest',
        dryRun,
      });

      const message = dryRun
        ? '✅ Deployment event published (YAML generation)'
        : '✅ Deployment event published (will be processed by K8s Generator)';
      this.logger.log(message);

      return {
        deployed: false, // Async, not deployed yet
        eventPublished: true,
        eventId,
        dryRun,
        message: 'Event published to Kafka. K8s Generator will process it.',
      };
    } catch (error: any) {
      this.logger.error(`❌ Failed to publish deployment event: ${error.message}`);
      return {
        deployed: false,
        eventPublished: false,
        error: error.message,
      };
    }
  }

  /**
   * Trigger deployment via HTTP (Sync, for testing)
   */
  private async triggerDeploymentViaHttp(changeset: any, dryRun = false): Promise<any> {
    try {
      const mode = dryRun ? 'DRY-RUN (YAML only)' : 'DEPLOY';
      this.logger.log(
        `🚀 [${mode}] Triggering K8s deployment for services: ${changeset.changeset.impacted_services.join(', ')}`,
      );

      const url = `${this.k8sGeneratorUrl}/k8s/generate-deployment${dryRun ? '?dryRun=true' : ''}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal_text: changeset.proposal_text,
          changeset: changeset.changeset,
          metadata: changeset.metadata,
          replicas: 1, // Default replicas
          version: 'latest', // Default version
        }),
      });

      if (!response.ok) {
        throw new Error(`K8s Generator error: ${response.status} ${await response.text()}`);
      }

      const result = await response.json();
      const message = dryRun
        ? '✅ YAML files generated successfully'
        : '✅ Deployment triggered successfully';
      this.logger.log(message);

      return {
        deployed: !dryRun,
        dryRun,
        result,
      };
    } catch (error: any) {
      this.logger.error(`❌ Failed to trigger deployment: ${error.message}`);
      return {
        deployed: false,
        error: error.message,
      };
    }
  }

  /**
   * Kiểm tra status của deployment
   */
  async checkDeploymentStatus(namespace: string, serviceName: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.k8sGeneratorUrl}/k8s/deployments/${namespace}/${serviceName}`,
      );

      if (!response.ok) {
        throw new Error(`K8s Generator error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      this.logger.error(`Failed to check deployment status: ${error.message}`);
      throw error;
    }
  }
}
