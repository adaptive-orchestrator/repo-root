import { InvoiceItemDto } from "./invoice-item.dto";

export class CreateInvoiceDto {
  orderId: number;
  orderNumber: string;
  customerId: number;
  items: InvoiceItemDto[];
  subtotal: number;
  tax: number;
  shippingCost?: number;
  discount?: number;
  totalAmount: number;
  dueDate: Date;
  notes?: string;
}