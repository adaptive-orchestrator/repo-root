-- =============================================
-- Rollback Script - Promotion Tables
-- Database: promotion_db
-- Date: 2025-01-26
-- Description: Remove promotion tables
-- WARNING: This will DELETE ALL promotion data!
-- =============================================

USE promotion_db;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop promotion_usage table
DROP TABLE IF EXISTS promotion_usage;
SELECT 'promotion_usage table dropped' AS status;

-- Drop promotions table
DROP TABLE IF EXISTS promotions;
SELECT 'promotions table dropped' AS status;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT '============================================' AS '';
SELECT 'Promotion tables rollback completed' AS status;
SELECT '============================================' AS '';
