import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CatalogueSvcService } from './catalogue-svc.service';

@Controller()
export class CatalogueSvcController {
  constructor(private readonly service: CatalogueSvcService) {}

  // Products
  @GrpcMethod('CatalogueService', 'CreateProduct')
  createProduct(data: any) {
    return this.service.createProduct(data);
  }

  @GrpcMethod('CatalogueService', 'GetAllProducts')
  async getAllProducts() {
    const products = await this.service.listProducts();
    return { products };
  }

  @GrpcMethod('CatalogueService', 'GetProductById')
  async getProductById(data: { id: number }) {
    const product = await this.service.findProductById(data.id);
    return { product, message: 'Product found' };
  }

  // Plans
  @GrpcMethod('CatalogueService', 'CreatePlan')
  createPlan(data: any) {
    return this.service.createPlan(data);
  }

  @GrpcMethod('CatalogueService', 'GetAllPlans')
  async getAllPlans() {
    const plans = await this.service.listPlans();
    return { plans };
  }

  @GrpcMethod('CatalogueService', 'GetPlanById')
  async getPlanById(data: { id: number }) {
    const plan = await this.service.findPlanById(data.id);
    return { plan, message: 'Plan found' };
  }

  // Features
  @GrpcMethod('CatalogueService', 'CreateFeature')
  createFeature(data: any) {
    return this.service.createFeature(data);
  }

  @GrpcMethod('CatalogueService', 'GetAllFeatures')
  async getAllFeatures() {
    const features = await this.service.listFeatures();
    return { features };
  }

  @GrpcMethod('CatalogueService', 'GetFeatureById')
  async getFeatureById(data: { id: number }) {
    const feature = await this.service.findFeatureById(data.id);
    return { feature, message: 'Feature found' };
  }
}
