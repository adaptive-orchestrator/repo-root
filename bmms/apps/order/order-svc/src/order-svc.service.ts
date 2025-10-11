
import { Injectable } from '@nestjs/common';
import { EventPublisher, EventTopics, OrderCreatedEvent, createBaseEvent } from '@bmms/event';

@Injectable()
export class OrderSvcService {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async createOrder(data: {
    customerId: string;
    items: Array<{ productId: string; quantity: number; price: number }>;
  }) {
    // 1. Tạo order
    const order = {
      id: crypto.randomUUID(),
      ...data,
      totalAmount: data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'PENDING',
      createdAt: new Date(),
    };

    // 2. Lưu vào DB
    // await this.orderRepository.save(order);

    // 3. Publish event
    const event: OrderCreatedEvent = {
      ...createBaseEvent(EventTopics.ORDER_CREATED, 'order-svc'),
       eventType: 'order.created',
      data: {
        orderId: order.id,
        customerId: order.customerId,
        items: order.items,
        totalAmount: order.totalAmount,
      },
    };

    await this.eventPublisher.publish(EventTopics.ORDER_CREATED, event);

    return order;
  }
}