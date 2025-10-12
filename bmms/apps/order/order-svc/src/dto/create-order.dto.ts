import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  customerId: number;
  items: OrderItemDto[];
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
}