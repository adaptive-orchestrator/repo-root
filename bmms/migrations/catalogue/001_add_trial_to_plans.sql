-- =============================================
-- Migration: Update Catalogue Plans Table
-- Database: catalogue_db
-- Date: 2025-01-26
-- Description: Add trial support to plans table
-- =============================================

USE catalogue_db;

-- Check if columns already exist before adding
SET @dbname = DATABASE();
SET @tablename = 'plans';
SET @columnname1 = 'trialEnabled';
SET @columnname2 = 'trialDays';

-- Add trialEnabled column if not exists
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE (table_name = @tablename)
       AND (table_schema = @dbname)
       AND (column_name = @columnname1)) > 0,
    "SELECT 'Column trialEnabled already exists' AS msg",
    "ALTER TABLE plans ADD COLUMN trialEnabled BOOLEAN DEFAULT FALSE AFTER features"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add trialDays column if not exists
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE (table_name = @tablename)
       AND (table_schema = @dbname)
       AND (column_name = @columnname2)) > 0,
    "SELECT 'Column trialDays already exists' AS msg",
    "ALTER TABLE plans ADD COLUMN trialDays INT DEFAULT 14 AFTER trialEnabled"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add comment
ALTER TABLE plans 
    COMMENT = 'Plans table with trial period support for subscriptions';

-- Verify changes
SELECT 
    'Plans table updated successfully' AS status,
    COUNT(*) AS total_plans,
    SUM(CASE WHEN trialEnabled = TRUE THEN 1 ELSE 0 END) AS plans_with_trial
FROM plans;
