/**
 * Base Event Interface - Tất cả events phải extend từ đây
 */
export interface BaseEvent {
  eventId: string; // UUID của event
  eventType: string; // Loại event
  timestamp: Date; // Thời gian xảy ra event
  source: string; // Service phát ra event
  version?: string; // Version của event schema
}

/**
 * Customer Events
 */
export interface CustomerCreatedEvent extends BaseEvent {
  eventType: 'customer.created';
  data: {
    customerId: string;
    email: string;
    name: string;
    phone?: string;
  };
}

export interface CustomerUpdatedEvent extends BaseEvent {
  eventType: 'customer.updated';
  data: {
    customerId: string;
    changes: Record<string, any>;
  };
}

/**
 * Order Events
 */
export interface OrderCreatedEvent extends BaseEvent {
  eventType: 'order.created';
  data: {
    orderId: string;
    customerId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
  };
}

export interface OrderCompletedEvent extends BaseEvent {
  eventType: 'order.completed';
  data: {
    orderId: string;
    customerId: string;
    completedAt: Date;
  };
}

/**
 * Product Events
 */
export interface ProductStockChangedEvent extends BaseEvent {
  eventType: 'product.stock.changed';
  data: {
    productId: string;
    previousStock: number;
    currentStock: number;
    changeReason: 'sale' | 'restock' | 'adjustment';
  };
}

/**
 * Payment Events
 */
export interface PaymentSuccessEvent extends BaseEvent {
  eventType: 'payment.success';
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    transactionId: string;
  };
}

export interface PaymentFailedEvent extends BaseEvent {
  eventType: 'payment.failed';
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    reason: string;
  };
}

/**
 * Helper function để tạo base event
 */
export function createBaseEvent(
  eventType: string,
  source: string,
): BaseEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType,
    timestamp: new Date(),
    source,
    version: '1.0',
  };
}