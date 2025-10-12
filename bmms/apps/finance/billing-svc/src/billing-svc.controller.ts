import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { BillingService } from './billing-svc.service';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

@Controller('api/v1/invoices')
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.service.getById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: UpdateInvoiceStatusDto) {
    return this.service.updateStatus(id, status);
  }

  @Post(':id/retry')
  retryPayment(@Param('id') id: number) {
    return this.service.retryPayment(id);
  }
}