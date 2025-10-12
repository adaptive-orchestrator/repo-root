export class PaymentRecordDto {
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'paypal' | 'other';
  amount: number;
  transactionId: string;
  notes?: string;
}