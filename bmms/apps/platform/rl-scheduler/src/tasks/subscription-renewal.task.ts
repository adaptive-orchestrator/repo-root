import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface SubscriptionGrpcService {
  getSubscriptionsByCustomer(data: any): any;
  renewSubscription(data: any): any;
  updateSubscriptionStatus(data: any): any;
}

interface BillingGrpcService {
  getInvoicesByStatus(data: any): any;
}

@Injectable()
export class SubscriptionRenewalTask implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionRenewalTask.name);
  private subscriptionService: SubscriptionGrpcService;
  private billingService: BillingGrpcService;

  constructor(
    @Inject('SUBSCRIPTION_PACKAGE') private readonly subscriptionClient: ClientGrpc,
    @Inject('BILLING_PACKAGE') private readonly billingClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.subscriptionService =
      this.subscriptionClient.getService<SubscriptionGrpcService>('SubscriptionService');
    this.billingService =
      this.billingClient.getService<BillingGrpcService>('BillingService');

    // Start all scheduled tasks
    this.startScheduledTasks();
  }

  private startScheduledTasks() {
    // Run subscription renewals every day at 2 AM
    this.scheduleDaily(2, 0, () => this.handleSubscriptionRenewals());

    // Run overdue subscription check every 6 hours
    this.scheduleEvery(6 * 60 * 60 * 1000, () => this.handleOverdueSubscriptions());

    // Run trial ending notifications every day at 9 AM
    this.scheduleDaily(9, 0, () => this.handleTrialEndingNotifications());

    // Run overdue invoice check every hour
    this.scheduleEvery(60 * 60 * 1000, () => this.handleOverdueInvoices());

    this.logger.log('✅ All scheduled tasks started');
  }

  private scheduleDaily(hour: number, minute: number, callback: () => void) {
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
    );

    // If scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime.getTime() - now.getTime();

    // Schedule first run
    setTimeout(() => {
      callback();
      // Then repeat daily
      setInterval(callback, 24 * 60 * 60 * 1000);
    }, timeUntilScheduled);

    this.logger.log(
      `📅 Scheduled daily task at ${hour}:${minute.toString().padStart(2, '0')}`,
    );
  }

  private scheduleEvery(intervalMs: number, callback: () => void) {
    // Run immediately
    callback();
    // Then repeat at interval
    setInterval(callback, intervalMs);

    const hours = intervalMs / (60 * 60 * 1000);
    this.logger.log(`⏰ Scheduled task every ${hours} hours`);
  }

  // Run every day at 2 AM
  async handleSubscriptionRenewals() {
    this.logger.log('🔄 Starting subscription renewal check...');

    try {
      // Get all active subscriptions that are ending today or tomorrow
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Note: You'll need to add a method in subscription-svc to get subscriptions by period end
      // For now, this is a placeholder
      const subscriptionsToRenew = await this.getSubscriptionsEndingSoon();

      this.logger.log(`Found ${subscriptionsToRenew.length} subscriptions to renew`);

      for (const subscription of subscriptionsToRenew) {
        try {
          await this.renewSubscription(subscription);
          this.logger.log(`✅ Renewed subscription #${subscription.id}`);
        } catch (error) {
          this.logger.error(
            `❌ Failed to renew subscription #${subscription.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('✅ Subscription renewal check completed');
    } catch (error) {
      this.logger.error(`❌ Subscription renewal task failed: ${error.message}`);
    }
  }

  // Run overdue subscription check every 6 hours
  async handleOverdueSubscriptions() {
    this.logger.log('⚠️ Checking for overdue subscriptions...');

    try {
      // Get all subscriptions with past_due status
      const overdueSubscriptions = await this.getOverdueSubscriptions();

      this.logger.log(`Found ${overdueSubscriptions.length} overdue subscriptions`);

      for (const subscription of overdueSubscriptions) {
        try {
          // Check how many days overdue
          const daysOverdue = this.calculateDaysOverdue(subscription.currentPeriodEnd);

          if (daysOverdue > 7) {
            // Cancel subscription after 7 days overdue
            await this.cancelOverdueSubscription(subscription);
            this.logger.log(`🚫 Cancelled overdue subscription #${subscription.id}`);
          } else {
            // Send reminder (would need notification service)
            this.logger.log(`📧 Reminder sent for subscription #${subscription.id}`);
          }
        } catch (error) {
          this.logger.error(
            `❌ Failed to process overdue subscription #${subscription.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('✅ Overdue subscription check completed');
    } catch (error) {
      this.logger.error(`❌ Overdue subscription task failed: ${error.message}`);
    }
  }

  // Run trial ending notifications every day at 9 AM
  async handleTrialEndingNotifications() {
    this.logger.log('📢 Checking for trials ending soon...');

    try {
      const trialsEndingSoon = await this.getTrialsEndingSoon();

      this.logger.log(`Found ${trialsEndingSoon.length} trials ending soon`);

      for (const subscription of trialsEndingSoon) {
        try {
          const daysUntilEnd = this.calculateDaysUntilTrialEnd(subscription.trialEnd);

          if (daysUntilEnd === 3 || daysUntilEnd === 1) {
            // Send notification 3 days and 1 day before trial ends
            await this.sendTrialEndingNotification(subscription, daysUntilEnd);
            this.logger.log(
              `📧 Trial ending notification sent for subscription #${subscription.id} (${daysUntilEnd} days left)`,
            );
          }
        } catch (error) {
          this.logger.error(
            `❌ Failed to send trial notification for #${subscription.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('✅ Trial ending notification check completed');
    } catch (error) {
      this.logger.error(`❌ Trial notification task failed: ${error.message}`);
    }
  }

  // Run overdue invoice check every hour
  async handleOverdueInvoices() {
    this.logger.log('💰 Checking for overdue invoices...');

    try {
      const overdueInvoices = await this.getOverdueInvoices();

      this.logger.log(`Found ${overdueInvoices.length} overdue invoices`);

      for (const invoice of overdueInvoices) {
        try {
          const daysOverdue = this.calculateDaysOverdue(invoice.dueDate);

          if (daysOverdue === 1 || daysOverdue === 3 || daysOverdue === 7) {
            // Send reminder at specific intervals
            await this.sendOverdueInvoiceReminder(invoice, daysOverdue);
            this.logger.log(`📧 Overdue invoice reminder sent for #${invoice.id}`);
          }
        } catch (error) {
          this.logger.error(
            `❌ Failed to send invoice reminder for #${invoice.id}: ${error.message}`,
          );
        }
      }

      this.logger.log('✅ Overdue invoice check completed');
    } catch (error) {
      this.logger.error(`❌ Overdue invoice task failed: ${error.message}`);
    }
  }

  // ============ Helper Methods ============

  private async getSubscriptionsEndingSoon(): Promise<any[]> {
    // TODO: Implement query to get subscriptions ending in next 24 hours
    // For now, return empty array
    return [];
  }

  private async getOverdueSubscriptions(): Promise<any[]> {
    // TODO: Query subscriptions with status = 'past_due'
    return [];
  }

  private async getTrialsEndingSoon(): Promise<any[]> {
    // TODO: Query subscriptions in trial with trialEnd in next 3 days
    return [];
  }

  private async getOverdueInvoices(): Promise<any[]> {
    try {
      const result: any = await firstValueFrom(
        this.billingService.getInvoicesByStatus({ status: 'unpaid' }),
      );
      
      const today = new Date();
      // Filter invoices that are overdue (dueDate < today)
      return result.invoices?.filter((invoice: any) => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate < today;
      }) || [];
    } catch (error) {
      this.logger.error(`Failed to get overdue invoices: ${error.message}`);
      return [];
    }
  }

  private async renewSubscription(subscription: any): Promise<void> {
    try {
      await firstValueFrom(
        this.subscriptionService.renewSubscription({
          id: subscription.id,
          isAutoRenewal: true,
        }),
      );
    } catch (error) {
      throw new Error(`Renewal failed: ${error.message}`);
    }
  }

  private async cancelOverdueSubscription(subscription: any): Promise<void> {
    try {
      await firstValueFrom(
        this.subscriptionService.updateSubscriptionStatus({
          id: subscription.id,
          status: 'cancelled',
          reason: 'Payment overdue for more than 7 days',
        }),
      );
    } catch (error) {
      throw new Error(`Cancellation failed: ${error.message}`);
    }
  }

  private async sendTrialEndingNotification(
    subscription: any,
    daysLeft: number,
  ): Promise<void> {
    // TODO: Integrate with notification service
    this.logger.log(
      `📧 [MOCK] Trial ending notification: Subscription #${subscription.id} expires in ${daysLeft} days`,
    );
  }

  private async sendOverdueInvoiceReminder(
    invoice: any,
    daysOverdue: number,
  ): Promise<void> {
    // TODO: Integrate with notification service
    this.logger.log(
      `📧 [MOCK] Overdue invoice reminder: Invoice #${invoice.id} is ${daysOverdue} days overdue`,
    );
  }

  private calculateDaysOverdue(endDate: string | Date): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = today.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  private calculateDaysUntilTrialEnd(trialEnd: string | Date): number {
    const end = new Date(trialEnd);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
