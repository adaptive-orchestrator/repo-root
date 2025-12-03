import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as yaml from 'js-yaml';

@Injectable()
export class K8sClientService implements OnModuleInit {
  private readonly logger = new Logger(K8sClientService.name);
  private kc: any;
  private k8sApi: any;
  private coreApi: any;
  private k8s: any;

  constructor() {}

  async onModuleInit() {
    // Dynamic import for ES Module
    this.k8s = await import('@kubernetes/client-node');
    await this.initializeK8sClient();
  }

  /**
   * Initialize Kubernetes client
   */
  private async initializeK8sClient() {
    this.kc = new this.k8s.KubeConfig();

    // Load config từ environment hoặc local kubeconfig
    if (process.env.KUBERNETES_SERVICE_HOST) {
      // Running inside K8s cluster
      this.kc.loadFromCluster();
      this.logger.log('[K8sGen] Running inside K8s cluster');
    } else {
      // Running locally, load from ~/.kube/config
      this.kc.loadFromDefault();
      this.logger.log('[K8sGen] Running locally with kubeconfig');
    }

    this.k8sApi = this.kc.makeApiClient(this.k8s.AppsV1Api);
    this.coreApi = this.kc.makeApiClient(this.k8s.CoreV1Api);
  }

  /**
   * Apply deployment to K8s cluster
   */
  async applyDeployment(namespace: string, yamlContent: string) {
    try {
      const deployment = yaml.load(yamlContent) as any;
      const name = deployment?.metadata?.name;

      if (!name) {
        throw new Error('Deployment name is required');
      }

      // Check if deployment exists
      try {
        await this.k8sApi.readNamespacedDeployment({ name, namespace });
        // Update existing deployment
        const response = await this.k8sApi.replaceNamespacedDeployment({
          name,
          namespace,
          body: deployment,
        });
        this.logger.log(`[K8sGen] Updated deployment: ${namespace}/${name}`);
        return response.body;
      } catch (error: any) {
        // Create new deployment
        const response = await this.k8sApi.createNamespacedDeployment({
          namespace,
          body: deployment,
        });
        this.logger.log(`[K8sGen] Created deployment: ${namespace}/${name}`);
        return response.body;
      }
    } catch (error: any) {
      this.logger.error(`Failed to apply deployment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Apply service to K8s cluster
   */
  async applyService(namespace: string, yamlContent: string) {
    try {
      const service = yaml.load(yamlContent) as any;
      const name = service?.metadata?.name;

      if (!name) {
        throw new Error('Service name is required');
      }

      // Check if service exists
      try {
        await this.coreApi.readNamespacedService({ name, namespace });
        // Update existing service
        const response = await this.coreApi.replaceNamespacedService({
          name,
          namespace,
          body: service,
        });
        this.logger.log(`[K8sGen] Updated service: ${namespace}/${name}`);
        return response.body;
      } catch (error: any) {
        // Create new service
        const response = await this.coreApi.createNamespacedService({
          namespace,
          body: service,
        });
        this.logger.log(`[K8sGen] Created service: ${namespace}/${name}`);
        return response.body;
      }
    } catch (error: any) {
      this.logger.error(`Failed to apply service: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update ConfigMap with new environment variables
   */
  async updateConfigMap(namespace: string, configMapName: string, data: Record<string, string>) {
    try {
      // Get existing ConfigMap
      const existing = await this.coreApi.readNamespacedConfigMap({
        name: configMapName,
        namespace,
      });
      
      // Merge with new data
      const updatedData = {
        ...existing.body.data,
        ...data,
      };

      // Update ConfigMap
      existing.body.data = updatedData;
      await this.coreApi.replaceNamespacedConfigMap({
        name: configMapName,
        namespace,
        body: existing.body,
      });
      
      this.logger.log(`[K8sGen] Updated ConfigMap: ${namespace}/${configMapName}`);
      return updatedData;
    } catch (error: any) {
      this.logger.error(`Failed to update ConfigMap: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all deployments across namespaces
   */
  async listAllDeployments() {
    try {
      const response = await this.k8sApi.listDeploymentForAllNamespaces();
      return response.body.items.map((deployment: any) => ({
        name: deployment.metadata?.name,
        namespace: deployment.metadata?.namespace,
        replicas: deployment.spec?.replicas,
        availableReplicas: deployment.status?.availableReplicas,
        image: deployment.spec?.template?.spec?.containers?.[0]?.image,
      }));
    } catch (error: any) {
      this.logger.error(`Failed to list deployments: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(namespace: string, name: string) {
    try {
      const response = await this.k8sApi.readNamespacedDeployment({ name, namespace });
      const deployment = response.body;

      return {
        name: deployment.metadata?.name,
        namespace: deployment.metadata?.namespace,
        replicas: deployment.spec?.replicas,
        availableReplicas: deployment.status?.availableReplicas,
        readyReplicas: deployment.status?.readyReplicas,
        conditions: deployment.status?.conditions,
      };
    } catch (error: any) {
      this.logger.error(`Failed to get deployment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(namespace: string, name: string) {
    try {
      await this.k8sApi.deleteNamespacedDeployment({ name, namespace });
      this.logger.log(`[K8sGen] Deleted deployment: ${namespace}/${name}`);
      return { deleted: true };
    } catch (error: any) {
      this.logger.error(`Failed to delete deployment: ${error.message}`);
      throw error;
    }
  }
}
