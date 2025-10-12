export class UpdateInvoiceStatusDto {
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
}