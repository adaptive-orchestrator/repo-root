import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import * as event from '@bmms/event';
import { OrderSvcService } from './order-svc.service';
import { CustomerSvcService } from 'apps/customer/customer-svc/src/customer-svc.service';

@Controller()
export class OrderEventListener {
  constructor(
    private readonly customerSvcService: CustomerSvcService,
    private readonly orderSvcService: OrderSvcService,
  ) {}

  /** ------------------- Customer Events ------------------- */

  @event.OnEvent(event.EventTopics.CUSTOMER_CREATED)
  async handleCustomerCreated(@Payload() event: event.CustomerCreatedEvent) {
    try {
      this.logEvent(event);

      // TODO: Implement business logic
      // e.g., create welcome voucher, send welcome email
      // await this.customerService.createWelcomeVoucher(event.data.customerId);
      // await this.customerService.sendWelcomeEmail(event.data.email);

    } catch (error) {
      console.error('Error handling CUSTOMER_CREATED event:', error);
    }
  }

  @event.OnEvent(event.EventTopics.CUSTOMER_UPDATED)
  async handleCustomerUpdated(@Payload() event: event.CustomerUpdatedEvent) {
    try {
      this.logEvent(event);

      // TODO: Implement business logic
      // e.g., update local cache, notify other services
      // await this.customerService.handleCustomerUpdate(event.data.customerId, event.data.changes);

    } catch (error) {
      console.error('Error handling CUSTOMER_UPDATED event:', error);
    }
  }

  /** ------------------- Payment Events ------------------- */

  @event.OnEvent(event.EventTopics.PAYMENT_SUCCESS)
  async handlePaymentSuccess(@Payload() event: event.PaymentSuccessEvent) {
    try {
      this.logEvent(event);

      const { orderId, transactionId } = event.data;

      // Update order status
      //await this.orderSvcService.updateOrderStatus(orderId, 'PAID');

      console.log(`✅ Order ${orderId} marked as PAID with transaction ${transactionId}`);

    } catch (error) {
      console.error('Error handling PAYMENT_SUCCESS event:', error);
    }
  }

  /** ------------------- Helper ------------------- */
  private logEvent<T extends { eventType: string }>(event: T) {
    console.log(`📥 Received event [${event.eventType}] at ${new Date().toISOString()}:`, event);
  }
}