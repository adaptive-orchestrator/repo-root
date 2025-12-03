import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { K8sGeneratorService } from '../k8s-generator.service';

@Controller()
export class KafkaConsumerService {
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private k8sGeneratorService: K8sGeneratorService) {
    this.logger.log('[K8sGen] Kafka consumer service initialized');
  }

  /**
   * Handle K8s deployment events from Kafka
   */
  @EventPattern('k8s.deployment.requests')
  async handleDeploymentEvent(
    @Payload() eventData: any,
    @Ctx() context: KafkaContext,
  ) {
    const partition = context.getPartition();
    const offset = context.getMessage().offset;
    const eventId = eventData.eventId || 'unknown';

    try {
      this.logger.log(`[K8sGen] Received event: ${eventId} (partition: ${partition}, offset: ${offset})`);
      this.logger.log(`   Services: ${eventData.changeset?.impacted_services?.join(', ') || 'none'}`);

      // Convert event to DTO
      const dto: any = {
        proposal_text: eventData.proposal_text,
        changeset: eventData.changeset,
        metadata: eventData.metadata,
        replicas: eventData.replicas || 1,
        version: eventData.version || 'latest',
      };

      const dryRun = eventData.dryRun || false;

      // Process deployment
      const result = await this.k8sGeneratorService.generateAndApply(dto, dryRun);

      this.logger.log(`[K8sGen] Event ${eventId} processed successfully`);
      this.logger.log(`   Results: ${result.results.length} services ${dryRun ? 'generated' : 'deployed'}`);

    } catch (error: any) {
      this.logger.error(`[ERROR] Failed to process event ${eventId}: ${error.message}`);
      // Note: Do NOT throw error here to avoid infinite retry loop
      // Consider implementing dead-letter queue for failed messages
    }
  }
}
