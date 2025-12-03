import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private deploymentTemplate: HandlebarsTemplateDelegate;
  private serviceTemplate: HandlebarsTemplateDelegate;
  private configMapTemplate: HandlebarsTemplateDelegate;

  constructor() {
    this.loadTemplates();
  }

  /**
   * Load Handlebars templates
   */
  private async loadTemplates() {
    try {
      // Fix: Use process.cwd() to find templates from project root
      const templateDir = join(process.cwd(), 'apps', 'platform', 'k8s-generator', 'src', 'templates');

      this.logger.log(`Loading templates from: ${templateDir}`);

      const deploymentTpl = await readFile(join(templateDir, 'deployment.yaml.hbs'), 'utf-8');
      const serviceTpl = await readFile(join(templateDir, 'service.yaml.hbs'), 'utf-8');
      const configMapTpl = await readFile(join(templateDir, 'configmap.yaml.hbs'), 'utf-8');

      this.deploymentTemplate = Handlebars.compile(deploymentTpl);
      this.serviceTemplate = Handlebars.compile(serviceTpl);
      this.configMapTemplate = Handlebars.compile(configMapTpl);

      this.logger.log('[K8sGen] Templates loaded successfully');
    } catch (error) {
      this.logger.error(`Failed to load templates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Render deployment YAML
   */
  async renderDeployment(config: any): Promise<string> {
    return this.deploymentTemplate(config);
  }

  /**
   * Render service YAML
   */
  async renderService(config: any): Promise<string> {
    return this.serviceTemplate(config);
  }

  /**
   * Render configmap YAML
   */
  async renderConfigMap(config: any): Promise<string> {
    return this.configMapTemplate(config);
  }
}
