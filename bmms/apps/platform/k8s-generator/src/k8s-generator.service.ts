import { Injectable, Logger } from '@nestjs/common';
import { TemplateService } from './services/template.service';
import { GenerateDeploymentDto } from './dto/generate-deployment.dto';
import { K8sClientService } from './services/k8s-client.service';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class K8sGeneratorService {
  private readonly logger = new Logger(K8sGeneratorService.name);

  constructor(
    private readonly templateService: TemplateService,
    private readonly k8sClient: K8sClientService,
  ) {}

  /**
   * Nhận LLM changeset và tự động:
   * 1. Sinh YAML files từ templates
   * 2. Apply vào K8s cluster (skip if dryRun=true)
   * 
   * SHARED SERVICE PATTERN:
   * - Each service in impacted_services array = 1 K8s Deployment
   * - Example: ["OrderService", "SubscriptionService"] = 2 deployments total
   * - retail_products_count/subscription_plans_count → ENV vars, NOT deployment count
   */
  async generateAndApply(dto: GenerateDeploymentDto, dryRun = false) {
    // Support both dto.impacted_services (getter) and dto.changeset.impacted_services
    const impactedServices = dto.impacted_services || dto.changeset?.impacted_services || [];
    
    if (!impactedServices || impactedServices.length === 0) {
      throw new Error('No impacted_services found in DTO');
    }
    
    this.logger.log(`Generating K8s manifests for services: ${impactedServices.join(', ')}`);
    
    if (dryRun) {
      this.logger.warn(`🔍 DRY-RUN MODE: YAML files will be generated but NOT applied to cluster`);
    }
    
    // Log shared service pattern info
    const productCount = dto.changeset?.features?.find(f => f.key === 'retail_products_count')?.value;
    const planCount = dto.changeset?.features?.find(f => f.key === 'subscription_plans_count')?.value;
    
    if (productCount || planCount) {
      this.logger.log(`📦 SHARED SERVICE PATTERN: ${productCount ? `${productCount} retail products` : ''} ${planCount ? `${planCount} subscription plans` : ''}`);
      this.logger.log(`→ Creating ${impactedServices.length} unique service deployments (NOT ${productCount || 0} + ${planCount || 0} deployments)`);
    }

    const results: Array<{
      service: string;
      status: 'success' | 'failed';
      deployment?: any;
      serviceEndpoint?: any;
      yamlFiles?: {
        deploymentPath: string;
        servicePath: string;
      };
      error?: string;
    }> = [];

    for (const serviceName of impactedServices) {
      try {
        // 1. Map service name to deployment config
        const deploymentConfig = this.mapServiceToDeployment(serviceName, dto);

        // 2. Generate YAML from template
        const deploymentYaml = await this.templateService.renderDeployment(deploymentConfig);
        const serviceYaml = await this.templateService.renderService(deploymentConfig);

        // 3. Save YAML files to disk (always do this)
        const yamlFiles = await this.saveYamlFiles(
          serviceName,
          deploymentConfig.namespace,
          deploymentYaml,
          serviceYaml,
        );

        // 4. Apply to K8s cluster (skip if dryRun)
        let deploymentResult: any;
        let serviceResult: any;

        if (!dryRun) {
          deploymentResult = await this.k8sClient.applyDeployment(
            deploymentConfig.namespace,
            deploymentYaml,
          );

          serviceResult = await this.k8sClient.applyService(
            deploymentConfig.namespace,
            serviceYaml,
          );

          // Update ConfigMap if needed
          if (deploymentConfig.envVars && Object.keys(deploymentConfig.envVars).length > 0) {
            await this.k8sClient.updateConfigMap(
              deploymentConfig.namespace,
              'env',
              deploymentConfig.envVars,
            );
          }
        }

        results.push({
          service: serviceName,
          status: 'success',
          deployment: deploymentResult,
          serviceEndpoint: serviceResult,
          yamlFiles,
        });

        this.logger.log(`✅ ${dryRun ? 'Generated YAML for' : 'Successfully deployed'} ${serviceName}`);
      } catch (error) {
        this.logger.error(`❌ Failed to deploy ${serviceName}: ${error.message}`);
        results.push({
          service: serviceName,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return {
      proposal: dto.proposal_text,
      results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Map service name từ LLM output sang deployment configuration
   */
  private mapServiceToDeployment(serviceName: string, dto: GenerateDeploymentDto): any {
    // Service name mapping (từ business name sang technical name)
    const serviceMap = {
      // Customer Domain
      AuthService: 'auth-svc',
      CustomerService: 'customer-svc',
      CRMOrchestratorService: 'crm-orchestrator',
      
      // Product Domain
      CatalogueService: 'catalogue-svc',
      ProductCatalogService: 'catalogue-svc',
      PricingEngineService: 'pricing-engine',
      PromotionService: 'promotion-svc',
      
      // Order Domain
      OrderService: 'order-svc',
      SubscriptionService: 'subscription-svc',
      InventoryService: 'inventory-svc',
      
      // Finance Domain
      BillingService: 'billing-svc',
      PaymentService: 'payment-svc',
      
      // Platform Domain
      APIGatewayService: 'api-gateway',
      LLMOrchestratorService: 'llm-orchestrator',
      CodeIndexerService: 'code-indexer',
      RLSchedulerService: 'rl-scheduler',
    };

    // Namespace mapping
    const namespaceMap = {
      // Customer domain
      'auth-svc': 'customer',
      'customer-svc': 'customer',
      'crm-orchestrator': 'customer',
      
      // Product domain
      'catalogue-svc': 'product',
      'pricing-engine': 'product',
      'promotion-svc': 'product',
      
      // Order domain
      'order-svc': 'order',
      'subscription-svc': 'order',
      'inventory-svc': 'order',
      
      // Finance domain
      'billing-svc': 'finance',
      'payment-svc': 'finance',
      
      // Platform domain
      'api-gateway': 'platform',
      'llm-orchestrator': 'platform',
      'code-indexer': 'platform',
      'rl-scheduler': 'platform',
    };

    // Port mapping
    const portMap = {
      'auth-svc': 3000,
      'customer-svc': 3001,
      'crm-orchestrator': 3002,
      'billing-svc': 3003,
      'catalogue-svc': 3007,
      'pricing-engine': 3008,
      'promotion-svc': 3009,
      'order-svc': 3011,
      'subscription-svc': 3012,
      'inventory-svc': 3013,
      'payment-svc': 3015,
      'api-gateway': 3099,
      'llm-orchestrator': 3019,
      'code-indexer': 3018,
      'rl-scheduler': 3017,
    };

    const technicalName = serviceMap[serviceName] || serviceName.toLowerCase().replace(/service$/, '-svc');
    const namespace = namespaceMap[technicalName] || 'default';
    const port = portMap[technicalName] || 3000;

    // Build env vars from changeset features
    // Note: retail_products_count, subscription_plans_count → ENV vars in the deployment
    // These are NOT used to create multiple deployments (SHARED SERVICE PATTERN)
    const envVars: Record<string, string> = {};
    if (dto.changeset?.features) {
      dto.changeset.features.forEach((feature) => {
        const envKey = feature.key.toUpperCase().replace(/\./g, '_');
        envVars[envKey] = String(feature.value);
      });
    }
    
    // Add service-specific metadata as ENV vars
    const productCount = dto.changeset?.features?.find(f => f.key === 'retail_products_count')?.value;
    if (productCount && technicalName === 'order-svc') {
      this.logger.log(`→ ${technicalName} will handle ${productCount} retail products via database`);
    }

    return {
      name: technicalName,
      namespace,
      port,
      replicas: dto.replicas || 1,
      image: `${process.env.DOCKER_REGISTRY || 'your-registry'}/${technicalName}:${dto.version || 'latest'}`,
      envVars,
      model: dto.changeset?.model,
      metadata: dto.metadata,
    };
  }

  /**
   * Save YAML files to disk
   * Path: bmms/k8s_generated/{namespace}/{service-name}-{deployment|service}.yaml
   */
  private async saveYamlFiles(
    serviceName: string,
    namespace: string,
    deploymentYaml: string,
    serviceYaml: string,
  ): Promise<{ deploymentPath: string; servicePath: string }> {
    const outputDir = join(process.cwd(), 'k8s_generated', namespace);
    
    // Create directory if not exists
    await mkdir(outputDir, { recursive: true });

    // Generate filenames
    const deploymentPath = join(outputDir, `${serviceName.toLowerCase()}-deployment.yaml`);
    const servicePath = join(outputDir, `${serviceName.toLowerCase()}-service.yaml`);

    // Write files
    await writeFile(deploymentPath, deploymentYaml, 'utf-8');
    await writeFile(servicePath, serviceYaml, 'utf-8');

    this.logger.log(`📝 Saved YAML files:`);
    this.logger.log(`   - ${deploymentPath}`);
    this.logger.log(`   - ${servicePath}`);

    return { deploymentPath, servicePath };
  }

  /**
   * List all deployments
   */
  async listDeployments() {
    return this.k8sClient.listAllDeployments();
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(namespace: string, name: string) {
    return this.k8sClient.getDeploymentStatus(namespace, name);
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(namespace: string, name: string) {
    return this.k8sClient.deleteDeployment(namespace, name);
  }
}
