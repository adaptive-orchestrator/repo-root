import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { crmOrchestratorService } from './crm-orchestrator.service';

@Controller('crm')
export class crmOrchestratorController {
  constructor(private readonly crmOrchestratorService: crmOrchestratorService) {}

  @Get()
  getHello(): string {
    return this.crmOrchestratorService.getHello();
  }

  @Get('insights/:customerId')
  async getCustomerInsights(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.crmOrchestratorService.getCustomerInsights(customerId);
  }

  @Post('recalculate/:customerId')
  async recalculateSegment(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.crmOrchestratorService.recalculateCustomerSegment(customerId);
  }
}
