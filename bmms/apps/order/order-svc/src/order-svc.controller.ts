import { Controller, Get } from '@nestjs/common';
import { OrderSvcService } from './order-svc.service';

@Controller()
export class OrderSvcController {
  constructor(private readonly OrderSvcService: OrderSvcService) {}

  // @Get()
  // getHello(): string {
  //   return this.OrderSvcService.getHello();
  // }
}
