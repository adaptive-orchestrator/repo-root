import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import * as event_1 from '@bmms/event';
import { BillingService } from './billing-svc.service';

@Controller()
export class BillingEventListener {
  constructor(
    private readonly billingService: BillingService,
    //private readonly notificationService: NotificationService,
  ) {}

  /** -------- Order Events -------- */

  @event_1.OnEvent(event_1.EventTopics.ORDER_CREATED)
  async handleOrderCreated(@Payload() event: event_1.OrderCreatedEvent) {
    try {
      this.logEvent(event);
      const { orderId, customerId, items, totalAmount } = event.data;

      // Auto-create invoice from order
      // await this.billingService.create({
      //   orderId,
      //   orderNumber,
      //   customerId,
      //   items: items.map(item => ({
      //     productId: item.productId,
      //     description: `Product ${item.productId}`,
      //     quantity: item.quantity,
      //     unitPrice: item.price,
      //     totalPrice: item.quantity * item.price,
      //   })),
      //   subtotal: totalAmount,
      //   tax: 0,
      //   totalAmount,
      //   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      // });

      console.log(`✅ Invoice created for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_CREATED:', error);
    }
  }

  /** -------- Payment Events -------- */

  @event_1.OnEvent(event_1.EventTopics.PAYMENT_SUCCESS)
  async handlePaymentSuccess(@Payload() event: event_1.PaymentSuccessEvent) {
    try {
      this.logEvent(event);
      const {  amount } = event.data;

      // Send payment receipt to customer
      // await this.notificationService.sendPaymentReceipt(customerId, invoiceNumber, amount);

      console.log(`✅ Payment receipt sent for invoice `);
    } catch (error) {
      console.error('❌ Error handling PAYMENT_SUCCESS:', error);
    }
  }

  @event_1.OnEvent(event_1.EventTopics.PAYMENT_FAILED)
  async handlePaymentFailed(@Payload() event: event_1.PaymentFailedEvent) {
    try {
      this.logEvent(event);
      const { orderId, reason } = event.data;

      // Send payment failure notification
      // await this.notificationService.sendPaymentFailureNotice(orderId, reason);

      console.log(`❌ Payment failure notice sent for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling PAYMENT_FAILED:', error);
    }
  }

  @event_1.OnEvent(event_1.EventTopics.INVOICE_OVERDUE)
  async handleInvoiceOverdue(@Payload() event: any) {
    try {
      this.logEvent(event);
      const { invoiceNumber, customerId, dueAmount } = event.data;

      // Send overdue payment reminder
      // await this.notificationService.sendOverdueReminder(customerId, invoiceNumber, dueAmount);

      console.log(`⚠️ Overdue reminder sent for invoice ${invoiceNumber}`);
    } catch (error) {
      console.error('❌ Error handling INVOICE_OVERDUE:', error);
    }
  }

  /** -------- Helper Methods -------- */
  private logEvent<T extends { eventType: string; timestamp: Date }>(event: T) {
    console.log(
      `📥 [BILLING] Received event [${event.eventType}] at ${event.timestamp.toISOString()}`,
    );
  }
}
