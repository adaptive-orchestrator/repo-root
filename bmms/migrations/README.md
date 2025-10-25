# Database Migration Guide

## Overview
This guide covers database migrations for the subscription (SaaS) model implementation.

## Migration Structure

```
migrations/
├── run_all_migrations.sql          # Master script to run all migrations
├── subscription/
│   ├── 001_create_subscriptions_table.sql
│   ├── 002_create_subscription_history_table.sql
│   └── rollback_all.sql
├── promotion/
│   ├── 001_create_promotions_table.sql
│   ├── 002_create_promotion_usage_table.sql
│   └── rollback_all.sql
├── billing/
│   ├── 001_add_subscription_support_to_invoices.sql
│   └── rollback_subscription_columns.sql
└── catalogue/
    ├── 001_add_trial_to_plans.sql
    └── rollback_trial_columns.sql
```

---

## Databases Affected

| Database | Tables Modified/Created | Purpose |
|----------|------------------------|---------|
| `subscription_db` | subscriptions, subscription_history | Main subscription data |
| `promotion_db` | promotions, promotion_usage | Discount codes & usage |
| `billing_db` | invoices (modified) | Add recurring invoice support |
| `catalogue_db` | plans (modified) | Add trial period fields |

---

## Running Migrations

### Prerequisites

1. **Backup all databases first!**
```bash
# Backup all databases
mysqldump -u root -p --all-databases > backup_before_migration_$(date +%Y%m%d).sql

# Or backup specific databases
mysqldump -u root -p subscription_db > subscription_db_backup.sql
mysqldump -u root -p promotion_db > promotion_db_backup.sql
mysqldump -u root -p billing_db > billing_db_backup.sql
mysqldump -u root -p catalogue_db > catalogue_db_backup.sql
```

2. **Ensure databases exist:**
```sql
CREATE DATABASE IF NOT EXISTS subscription_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS promotion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- billing_db and catalogue_db should already exist
```

### Option 1: Run All Migrations at Once

```bash
# From project root
cd c:\Users\vulin\Desktop\repo-root\bmms

# Run master migration script
mysql -u root -p < migrations/run_all_migrations.sql
```

### Option 2: Run Migrations Individually

```bash
# 1. Catalogue changes (add trial to plans)
mysql -u root -p < migrations/catalogue/001_add_trial_to_plans.sql

# 2. Create subscription tables
mysql -u root -p < migrations/subscription/001_create_subscriptions_table.sql
mysql -u root -p < migrations/subscription/002_create_subscription_history_table.sql

# 3. Update billing invoices
mysql -u root -p < migrations/billing/001_add_subscription_support_to_invoices.sql

# 4. Create promotion tables
mysql -u root -p < migrations/promotion/001_create_promotions_table.sql
mysql -u root -p < migrations/promotion/002_create_promotion_usage_table.sql
```

### Option 3: Run from MySQL Client

```sql
-- Login to MySQL
mysql -u root -p

-- Run migrations
SOURCE c:/Users/vulin/Desktop/repo-root/bmms/migrations/run_all_migrations.sql;
```

---

## Verification

### Check Tables Were Created

```sql
-- Check subscription_db
USE subscription_db;
SHOW TABLES;
DESCRIBE subscriptions;
DESCRIBE subscription_history;

-- Check promotion_db
USE promotion_db;
SHOW TABLES;
DESCRIBE promotions;
DESCRIBE promotion_usage;

-- Check billing_db changes
USE billing_db;
DESCRIBE invoices;
SHOW COLUMNS FROM invoices LIKE '%subscription%';
SHOW COLUMNS FROM invoices LIKE 'invoiceType';

-- Check catalogue_db changes
USE catalogue_db;
DESCRIBE plans;
SHOW COLUMNS FROM plans LIKE 'trial%';
```

### Verify Indexes

```sql
-- Check subscription indexes
USE subscription_db;
SHOW INDEX FROM subscriptions;
SHOW INDEX FROM subscription_history;

-- Check promotion indexes
USE promotion_db;
SHOW INDEX FROM promotions;
SHOW INDEX FROM promotion_usage;

-- Check billing indexes
USE billing_db;
SHOW INDEX FROM invoices WHERE Key_name LIKE 'idx_subscription%';
```

---

## Rollback (Emergency Only!)

⚠️ **WARNING: Rollback will DELETE ALL DATA in affected tables!**

### Rollback All Changes

```bash
# Rollback in reverse order
mysql -u root -p < migrations/promotion/rollback_all.sql
mysql -u root -p < migrations/billing/rollback_subscription_columns.sql
mysql -u root -p < migrations/subscription/rollback_all.sql
mysql -u root -p < migrations/catalogue/rollback_trial_columns.sql
```

### Rollback Individual Services

```bash
# Rollback subscription tables only
mysql -u root -p < migrations/subscription/rollback_all.sql

# Rollback promotion tables only
mysql -u root -p < migrations/promotion/rollback_all.sql

# Rollback billing changes only
mysql -u root -p < migrations/billing/rollback_subscription_columns.sql

# Rollback catalogue changes only
mysql -u root -p < migrations/catalogue/rollback_trial_columns.sql
```

---

## Migration Details

### 1. Subscription Tables

#### `subscriptions` table
```sql
- id (PK)
- customerId, planId
- status (trial, active, past_due, cancelled, paused)
- trialStart, trialEnd, isTrialUsed
- startDate, endDate
- currentPeriodStart, currentPeriodEnd
- cancelAtPeriodEnd, cancelledAt, cancellationReason
- createdAt, updatedAt
```

**Indexes:**
- `idx_customer` (customerId)
- `idx_plan` (planId)
- `idx_status` (status)
- `idx_period_end` (currentPeriodEnd)
- `idx_trial_end` (trialEnd)

#### `subscription_history` table
```sql
- id (PK)
- subscriptionId (FK)
- action
- previousValue, newValue, reason
- createdAt
```

---

### 2. Promotion Tables

#### `promotions` table
```sql
- id (PK)
- code (UNIQUE)
- name, description
- type (percentage, fixed_amount, trial_extension, free_months)
- status (active, inactive, expired)
- discountValue, trialExtensionDays, freeMonths
- applicableTo, specificPlanIds
- maxUses, currentUses, maxUsesPerCustomer
- validFrom, validUntil
- minPurchaseAmount, isFirstTimeOnly, isRecurring
- createdAt, updatedAt
```

#### `promotion_usage` table
```sql
- id (PK)
- promotionId (FK)
- customerId, subscriptionId
- discountAmount, originalAmount, finalAmount
- metadata
- usedAt
```

---

### 3. Billing Changes

**Added to `invoices` table:**
```sql
- invoiceType ENUM('onetime', 'recurring')
- subscriptionId INT
- periodStart TIMESTAMP
- periodEnd TIMESTAMP
```

**New Indexes:**
- `idx_subscription` (subscriptionId)
- `idx_invoice_type` (invoiceType)

---

### 4. Catalogue Changes

**Added to `plans` table:**
```sql
- trialEnabled BOOLEAN DEFAULT FALSE
- trialDays INT DEFAULT 14
```

---

## TypeORM Sync vs Migrations

Currently, services use `synchronize: true` in TypeORM config:

```typescript
// In db.module.ts
return {
  type: 'mysql',
  synchronize: true, // ⚠️ Auto-sync entities with DB
  autoLoadEntities: true,
  // ...
}
```

### Development vs Production

**Development (Current):**
- `synchronize: true` - TypeORM auto-creates/updates tables
- Fast iteration, but risky for data loss
- Run SQL migrations once to create tables
- TypeORM will maintain schema after

**Production (Recommended):**
```typescript
synchronize: process.env.NODE_ENV !== 'production'
```
- Use migrations only in production
- Disable auto-sync to prevent accidental schema changes
- Version control all schema changes

---

## Common Issues & Solutions

### Issue 1: Table Already Exists
```
ERROR 1050 (42S01): Table 'subscriptions' already exists
```

**Solution:**
Migrations use `CREATE TABLE IF NOT EXISTS` - safe to re-run.
If using TypeORM sync, tables may already exist.

### Issue 2: Column Already Exists
```
ERROR 1060 (42S21): Duplicate column name 'invoiceType'
```

**Solution:**
Migrations check column existence before adding. Re-run migration.

### Issue 3: Foreign Key Constraint Fails
```
ERROR 1452 (23000): Cannot add or update a child row
```

**Solution:**
Ensure parent tables exist first. Run migrations in order:
1. Catalogue
2. Subscription
3. Billing
4. Promotion

### Issue 4: Access Denied
```
ERROR 1044 (42000): Access denied for user
```

**Solution:**
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON subscription_db.* TO 'bmms_user'@'localhost';
GRANT ALL PRIVILEGES ON promotion_db.* TO 'bmms_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Seed Data (Optional)

### Create Sample Plans with Trial

```sql
USE catalogue_db;

-- Add trial to existing plans
UPDATE plans 
SET trialEnabled = TRUE, 
    trialDays = 14 
WHERE id IN (1, 2, 3);

-- Or insert new plan with trial
INSERT INTO plans (name, description, price, billingCycle, trialEnabled, trialDays)
VALUES ('Premium Plan', 'Full access with 14-day trial', 29.99, 'monthly', TRUE, 14);
```

### Create Sample Promotions

```sql
USE promotion_db;

-- Percentage discount
INSERT INTO promotions (code, name, description, type, discountValue, applicableTo, maxUses, validFrom, validUntil)
VALUES ('LAUNCH50', 'Launch Sale', '50% off for first 100 customers', 'percentage', 50, 'all_plans', 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));

-- Trial extension
INSERT INTO promotions (code, name, type, trialExtensionDays, applicableTo)
VALUES ('TRIAL30', 'Extended Trial', 'trial_extension', 16, 'all_plans');

-- Free months
INSERT INTO promotions (code, name, type, freeMonths, applicableTo, isFirstTimeOnly)
VALUES ('ANNUAL2FREE', 'Annual Bonus', 'free_months', 2, 'all_plans', TRUE);
```

---

## Monitoring & Maintenance

### Regular Checks

```sql
-- Check subscription status distribution
USE subscription_db;
SELECT status, COUNT(*) as count 
FROM subscriptions 
GROUP BY status;

-- Check promotion usage
USE promotion_db;
SELECT 
    p.code,
    p.currentUses,
    p.maxUses,
    COUNT(pu.id) as actual_uses
FROM promotions p
LEFT JOIN promotion_usage pu ON p.id = pu.promotionId
GROUP BY p.id;

-- Check invoice types
USE billing_db;
SELECT 
    invoiceType,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM invoices
GROUP BY invoiceType;
```

### Performance Monitoring

```sql
-- Check index usage
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'subscription_db'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Check table sizes
SELECT 
    table_schema as 'Database',
    table_name as 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema IN ('subscription_db', 'promotion_db')
ORDER BY (data_length + index_length) DESC;
```

---

## Next Steps

After running migrations:

1. ✅ **Start Services:**
   ```bash
   npm run start subscription-svc
   npm run start promotion-svc
   npm run start billing-svc
   npm run start catalogue-svc
   ```

2. ✅ **Verify TypeORM Sync:**
   - Check logs for "Database connected" messages
   - No schema sync errors should appear

3. ✅ **Test CRUD Operations:**
   - Create test subscription
   - Create test promotion
   - Generate test invoice

4. ✅ **Monitor Logs:**
   - Watch for any database connection errors
   - Check query performance

---

## Support & Troubleshooting

If you encounter issues:

1. Check logs in each service
2. Verify database connections in .env
3. Ensure all required databases exist
4. Check user permissions
5. Review foreign key constraints

For urgent issues, rollback and restore from backup.

---

## Summary

✅ **Migrations Created:**
- 6 migration scripts
- 4 rollback scripts
- 1 master script

✅ **Tables:**
- 2 new tables in subscription_db
- 2 new tables in promotion_db
- Modified invoices table
- Modified plans table

✅ **Indexes:**
- 13 new indexes for query optimization

✅ **Safety:**
- All migrations check existence before creating
- Rollback scripts available
- Backup instructions provided

🚀 **Ready to deploy!**
