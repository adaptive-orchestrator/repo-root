export class OrderItemDto {
  productId: number;
  quantity: number;
  price: number; // Price at time of order
  notes?: string;
}