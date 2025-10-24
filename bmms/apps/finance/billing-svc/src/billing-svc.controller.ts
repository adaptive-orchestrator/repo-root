import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BillingService } from './billing-svc.service';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

@Controller('api/v1/invoices')
export class BillingController {
  constructor(private readonly service: BillingService) {}

  // =================== HTTP REST API ENDPOINTS ===================
  
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

  // =================== gRPC METHODS FOR API GATEWAY ===================
  
  @GrpcMethod('BillingService', 'CreateInvoice')
  async grpcCreateInvoice(data: any) {
    return { invoice: await this.service.create(data) };
  }

  @GrpcMethod('BillingService', 'GetAllInvoices')
  async grpcGetAllInvoices() {
    const invoices = await this.service.list();
    return { invoices };
  }

  @GrpcMethod('BillingService', 'GetInvoiceById')
  async grpcGetInvoiceById(data: { id: number }) {
    return { invoice: await this.service.getById(data.id) };
  }

  @GrpcMethod('BillingService', 'UpdateInvoiceStatus')
  async grpcUpdateInvoiceStatus(data: { id: number; status: string }) {
    return { invoice: await this.service.updateStatus(data.id, data.status as any) };
  }

  @GrpcMethod('BillingService', 'RetryPayment')
  async grpcRetryPayment(data: { id: number }) {
    const result = await this.service.retryPayment(data.id);
    return { message: 'Payment retry initiated', success: true };
  }
}