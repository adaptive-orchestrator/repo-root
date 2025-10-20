export class ReleaseInventoryDto {
  productId: number;
  quantity: number;
  orderId: number;
  reason: 'order_cancelled' | 'order_completed' | 'manual_release';
}
