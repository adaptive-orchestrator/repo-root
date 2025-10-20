import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly ApiGatewayService: ApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.ApiGatewayService.getHello();
  }
}
