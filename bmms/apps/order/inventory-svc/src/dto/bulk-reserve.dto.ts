export class BulkReserveDto {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  orderId: number;
  customerId: number;
}