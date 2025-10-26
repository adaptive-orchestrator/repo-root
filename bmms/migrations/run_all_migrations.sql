-- =============================================
-- Master Migration Script
-- Date: 2025-01-26
-- Description: Run all migrations in correct order
-- Usage: mysql -u root -p < run_all_migrations.sql
-- =============================================

-- ============================================
-- 1. CATALOGUE SERVICE MIGRATIONS
-- ============================================
SOURCE migrations/catalogue/001_add_trial_to_plans.sql;

-- ============================================
-- 2. SUBSCRIPTION SERVICE MIGRATIONS
-- ============================================
SOURCE migrations/subscription/001_create_subscriptions_table.sql;
SOURCE migrations/subscription/002_create_subscription_history_table.sql;

-- ============================================
-- 3. BILLING SERVICE MIGRATIONS
-- ============================================
SOURCE migrations/billing/001_add_subscription_support_to_invoices.sql;

-- ============================================
-- 4. PROMOTION SERVICE MIGRATIONS
-- ============================================
SOURCE migrations/promotion/001_create_promotions_table.sql;
SOURCE migrations/promotion/002_create_promotion_usage_table.sql;

-- ============================================
-- 5. PAYMENT RETRY MIGRATIONS
-- ============================================
SOURCE migrations/006_payment_retries.sql;

-- ============================================
-- SUMMARY
-- ============================================
SELECT '============================================' AS '';
SELECT 'ALL MIGRATIONS COMPLETED SUCCESSFULLY' AS status;
SELECT '============================================' AS '';

-- Show table counts
SELECT 'CATALOGUE DATABASE' AS database_name;
USE catalogue_db;
SELECT 
    'plans' AS table_name,
    COUNT(*) AS row_count
FROM plans;

SELECT 'SUBSCRIPTION DATABASE' AS database_name;
USE subscription_db;
SELECT 
    'subscriptions' AS table_name,
    COUNT(*) AS row_count
FROM subscriptions
UNION ALL
SELECT 
    'subscription_history' AS table_name,
    COUNT(*) AS row_count
FROM subscription_history;

SELECT 'BILLING DATABASE' AS database_name;
USE billing_db;
SELECT 
    'invoices' AS table_name,
    COUNT(*) AS row_count
FROM invoices;

SELECT 'PROMOTION DATABASE' AS database_name;
USE promotion_db;
SELECT 
    'promotions' AS table_name,
    COUNT(*) AS row_count
FROM promotions
UNION ALL
SELECT 
    'promotion_usage' AS table_name,
    COUNT(*) AS row_count
FROM promotion_usage;

SELECT 'PAYMENT DATABASE' AS database_name;
USE payment_db;
SELECT 
    'payment_retries' AS table_name,
    COUNT(*) AS row_count
FROM payment_retries;

SELECT '============================================' AS '';
SELECT 'Migration completed at: ' AS '', NOW() AS timestamp;
SELECT '============================================' AS '';
