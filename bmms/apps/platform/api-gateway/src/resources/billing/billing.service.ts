import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

interface IBillingGrpcService {
  createInvoice(data: any): any;
  getAllInvoices(data: any): any;
  getInvoiceById(data: any): any;
  updateInvoiceStatus(data: any): any;
  retryPayment(data: any): any;
}

@Injectable()
export class BillingService implements OnModuleInit {
  private billingService: IBillingGrpcService;

  constructor(
    @Inject('BILLING_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.billingService = this.client.getService<IBillingGrpcService>('BillingService');
  }

  async createInvoice(dto: CreateInvoiceDto) {
    const response: any = await firstValueFrom(this.billingService.createInvoice(dto));
    return response.invoice;
  }

  async getAllInvoices() {
    const response: any = await firstValueFrom(this.billingService.getAllInvoices({}));
    return response.invoices;
  }

  async getInvoiceById(id: number) {
    const response: any = await firstValueFrom(this.billingService.getInvoiceById({ id }));
    return response.invoice;
  }

  async updateInvoiceStatus(id: number, dto: UpdateInvoiceStatusDto) {
    const response: any = await firstValueFrom(
      this.billingService.updateInvoiceStatus({ 
        id, 
        status: dto.status 
      })
    );
    return response.invoice;
  }

  async retryPayment(id: number) {
    return firstValueFrom(this.billingService.retryPayment({ id }));
  }
}
