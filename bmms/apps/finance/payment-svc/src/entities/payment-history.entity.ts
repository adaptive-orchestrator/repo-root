import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('payment_history')
@Index(['paymentId'])
@Index(['invoiceId'])
@Index(['createdAt'])
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  paymentId: number;

  @Column({ type: 'bigint' })
  invoiceId: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  action: 'initiated' | 'processing' | 'success' | 'failed' | 'refunded';

  @Column({ type: 'text', nullable: true })
  details?: string;

  @CreateDateColumn()
  createdAt: Date;
}