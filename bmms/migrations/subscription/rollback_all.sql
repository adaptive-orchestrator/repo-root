-- =============================================
-- Rollback Script - Subscription Tables
-- Database: subscription_db
-- Date: 2025-01-26
-- Description: Remove subscription tables
-- WARNING: This will DELETE ALL subscription data!
-- =============================================

USE subscription_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop subscription_history table
DROP TABLE IF EXISTS subscription_history;
SELECT 'subscription_history table dropped' AS status;

-- Drop subscriptions table
DROP TABLE IF EXISTS subscriptions;
SELECT 'subscriptions table dropped' AS status;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT '============================================' AS '';
SELECT 'Subscription tables rollback completed' AS status;
SELECT '============================================' AS '';
