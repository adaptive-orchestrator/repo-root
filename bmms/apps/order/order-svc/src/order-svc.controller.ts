import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderSvcService } from './order-svc.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrderSvcController {
  constructor(private readonly service: OrderSvcService) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  async createOrder(data: any) {
    return this.service.create(data);
  }

  @GrpcMethod('OrderService', 'GetAllOrders')
  async getAllOrders(data: { page?: number; limit?: number; customerId?: string }) {
    return this.service.list();
  }

  @GrpcMethod('OrderService', 'GetOrderById')
  async getOrderById(data: { id: number }) {
    return this.service.getById(data.id);
  }

  @GrpcMethod('OrderService', 'GetOrdersByCustomer')
  async getOrdersByCustomer(data: { customerId: string; page?: number; limit?: number }) {
    return this.service.getByCustomerId(data.customerId, data.page, data.limit);
  }

  @GrpcMethod('OrderService', 'UpdateOrderStatus')
  async updateOrderStatus(data: { id: number; status: string }) {
    return this.service.updateStatus(data.id, { status: data.status } as UpdateStatusDto);
  }

  @GrpcMethod('OrderService', 'CancelOrder')
  async cancelOrder(data: { id: number; reason?: string }) {
    return this.service.cancel(data.id, data.reason);
  }

  @GrpcMethod('OrderService', 'AddItemToOrder')
  async addItemToOrder(data: { orderId: number; productId: string; quantity: number; unitPrice: number }) {
    return this.service.addItem(data.orderId, {
      productId: Number(data.productId), // Convert string to number
      quantity: data.quantity,
      price: data.unitPrice, // Map unitPrice to price
    });
  }
}