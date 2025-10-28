import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { GenerateDeploymentDto } from './dto/generate-deployment.dto';
import { K8sGeneratorService } from './k8s-generator.service';

@Controller('k8s')
export class K8sGeneratorController {
  constructor(private readonly k8sGeneratorService: K8sGeneratorService) {}

  /**
   * Nhận LLM output và tự động sinh + apply K8s deployment
   * Query param: ?dryRun=true để chỉ sinh YAML không apply
   */
  @Post('generate-deployment')
  async generateDeployment(
    @Body() dto: GenerateDeploymentDto,
    @Query('dryRun') dryRun?: string,
  ) {
    const isDryRun = dryRun === 'true';
    return this.k8sGeneratorService.generateAndApply(dto, isDryRun);
  }

  /**
   * Lấy danh sách deployments đã tạo
   */
  @Get('deployments')
  async listDeployments() {
    return this.k8sGeneratorService.listDeployments();
  }

  /**
   * Kiểm tra trạng thái deployment
   */
  @Get('deployments/:namespace/:name')
  async getDeploymentStatus(
    @Param('namespace') namespace: string,
    @Param('name') name: string,
  ) {
    return this.k8sGeneratorService.getDeploymentStatus(namespace, name);
  }

  /**
   * Xóa deployment
   */
  @Post('deployments/:namespace/:name/delete')
  async deleteDeployment(
    @Param('namespace') namespace: string,
    @Param('name') name: string,
  ) {
    return this.k8sGeneratorService.deleteDeployment(namespace, name);
  }
}
