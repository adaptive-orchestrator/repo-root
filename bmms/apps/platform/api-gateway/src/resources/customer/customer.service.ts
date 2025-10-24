import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface ICustomerGrpcService {
  getAllCustomers(data: any): any;
  getCustomerById(data: { id: number }): any;
  getCustomerByEmail(data: { email: string }): any;
  updateCustomer(data: any): any;
  deleteCustomer(data: { id: number }): any;
}

@Injectable()
export class CustomerService implements OnModuleInit {
  private customerService: ICustomerGrpcService;

  constructor(@Inject('CUSTOMER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.customerService = this.client.getService<ICustomerGrpcService>('CustomerService');
  }

  async getAllCustomers(page: number = 1, limit: number = 10, segment?: string) {
    return firstValueFrom(
      this.customerService.getAllCustomers({ page, limit, segment }),
    );
  }

  async getCustomerById(id: number) {
    return firstValueFrom(
      this.customerService.getCustomerById({ id }),
    );
  }

  async getCustomerByEmail(email: string) {
    return firstValueFrom(
      this.customerService.getCustomerByEmail({ email }),
    );
  }

  async updateCustomer(id: number, updateData: any) {
    return firstValueFrom(
      this.customerService.updateCustomer({ id, ...updateData }),
    );
  }

  async deleteCustomer(id: number) {
    return firstValueFrom(
      this.customerService.deleteCustomer({ id }),
    );
  }
}
