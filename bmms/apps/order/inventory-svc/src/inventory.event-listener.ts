import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import * as event from '@bmms/event';
import { InventoryService } from './inventory-svc.service';

@Controller()
export class InventoryEventListener {
  constructor(
    private readonly inventoryService: InventoryService,
    //private readonly notificationService: NotificationService,
  ) {}

  /** -------- Product Events -------- */

  @event.OnEvent(event.EventTopics.PRODUCT_CREATED)
  async handleProductCreated(@Payload() event: event.ProductCreatedEvent) {
    try {
      this.logEvent(event);
      const { id: productId, name } = event.data;

      // Create initial inventory record
      // await this.inventoryService.create({
      //   productId,
      //   quantity: 0,
      //   reorderLevel: 10,
      // });

      console.log(`✅ Inventory initialized for new product: ${name}`);
    } catch (error) {
      console.error('❌ Error handling PRODUCT_CREATED:', error);
    }
  }

  /** -------- Order Events -------- */

  @event.OnEvent(event.EventTopics.ORDER_CREATED)
  async handleOrderCreated(@Payload() event: event.OrderCreatedEvent) {
    try {
      this.logEvent(event);
      const { orderId, items } = event.data;

      // Reserve inventory for all items in order
      // await this.inventoryService.bulkReserve({
      //   items,
      //   orderId: orderId.toString(),
      //   customerId: event.data.customerId,
      // });

      console.log(`✅ Reserved inventory for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_CREATED:', error);
      // TODO: Send alert to admin about reservation failure
    }
  }

  @event.OnEvent(event.EventTopics.ORDER_COMPLETED)
  async handleOrderCompleted(@Payload() event: event.OrderCompletedEvent) {
    try {
      this.logEvent(event);
      const { orderId } = event.data;

      // Complete all reservations for order
      // Deduct from stock
      // await this.inventoryService.completeReservations(orderId.toString());

      console.log(`✅ Completed inventory reservations for order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_COMPLETED:', error);
    }
  }

  @event.OnEvent(event.EventTopics.ORDER_CANCELLED)
  async handleOrderCancelled(@Payload() event: event.OrderCancelledEvent) {
    try {
      this.logEvent(event);
      const { orderId, reason } = event.data;

      // Release all reserved inventory
      // await this.inventoryService.cancelReservations(orderId.toString());

      console.log(`✅ Released inventory for cancelled order ${orderId}`);
    } catch (error) {
      console.error('❌ Error handling ORDER_CANCELLED:', error);
    }
  }

  /** -------- Helper Methods -------- */
  private logEvent<T extends { eventType: string; timestamp: Date }>(event: T) {
    console.log(
      `📥 [INVENTORY] Received event [${event.eventType}] at ${event.timestamp.toISOString()}`,
    );
  }
}
