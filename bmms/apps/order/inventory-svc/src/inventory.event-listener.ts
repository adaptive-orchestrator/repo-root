import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as event from '@bmms/event';
import { InventoryService } from './inventory-svc.service';

@Controller()
export class InventoryEventListener {
  constructor(
    private readonly inventoryService: InventoryService,
  ) {}

  /** -------- Product Events -------- */

  @EventPattern(event.EventTopics.PRODUCT_CREATED)
  async handleProductCreated(@Payload() event: event.ProductCreatedEvent) {
    try {
      this.logEvent(event);
      const { id: productId, name } = event.data;

      // Create initial inventory record
      await this.inventoryService.createInventoryForProduct(productId, 0, 10);

      console.log(`✅ Inventory initialized for new product: ${name} (ID: ${productId})`);
    } catch (error) {
      console.error('❌ Error handling PRODUCT_CREATED:', error);
    }
  }

  /** -------- Order Events -------- */

  @EventPattern(event.EventTopics.ORDER_CREATED)
  async handleOrderCreated(@Payload() event: event.OrderCreatedEvent) {
    try {
      this.logEvent(event);
      const { orderId, orderNumber, items, customerId } = event.data;

      console.log(`📦 Processing inventory reservation for order ${orderNumber} (ID: ${orderId})`);

      // Reserve inventory for each item in order
      for (const item of items) {
        const { productId, quantity } = item;

        try {
          // Reserve stock
          const reservation = await this.inventoryService.reserveStock(
            productId,
            quantity,
            orderId.toString(),
            customerId,
          );

          console.log(`✅ Reserved ${quantity} units of product ${productId} for order ${orderNumber}`);
        } catch (error) {
          console.error(`❌ Failed to reserve product ${productId} for order ${orderNumber}:`, error.message);
          
          // TODO: Implement compensation logic
          // - Release already reserved items
          // - Notify order service about reservation failure
          // - Update order status to 'RESERVATION_FAILED'
          throw error;
        }
      }

      console.log(`✅ All inventory reserved successfully for order ${orderNumber}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_CREATED:', error);
      // TODO: Send alert to admin about reservation failure
      // TODO: Emit ORDER_RESERVATION_FAILED event back to order service
    }
  }

  @EventPattern(event.EventTopics.ORDER_COMPLETED)
  async handleOrderCompleted(@Payload() event: event.OrderCompletedEvent) {
    try {
      this.logEvent(event);
      const { orderId } = event.data;

      // Complete all reservations for order (convert reserved -> actual deduction)
      await this.inventoryService.completeReservations(orderId);

      console.log(`✅ Completed inventory reservations for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_COMPLETED:', error);
    }
  }

  @EventPattern(event.EventTopics.ORDER_CANCELLED)
  async handleOrderCancelled(@Payload() event: event.OrderCancelledEvent) {
    try {
      this.logEvent(event);
      const { orderId, reason } = event.data;

      // Release all reserved inventory back to available stock
      await this.inventoryService.releaseReservations(orderId, 'order_cancelled');

      console.log(`✅ Released inventory for cancelled order ${orderId} (Reason: ${reason})`);
    } catch (error) {
      console.error('❌ Error handling ORDER_CANCELLED:', error);
    }
  }

   private logEvent<T extends { eventType: string; timestamp: Date | string }>(event: T) {
    const timestamp = typeof event.timestamp === 'string'
      ? new Date(event.timestamp).toISOString()
      : event.timestamp.toISOString();

    console.log(
      `🔥 [BILLING] Received event [${event.eventType}] at ${timestamp}`,
    );
  }
}