-- =============================================
-- Rollback Script - Catalogue Changes
-- Database: catalogue_db
-- Date: 2025-01-26
-- Description: Remove trial columns from plans table
-- =============================================

USE catalogue_db;

-- Remove trialDays column if exists
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'plans'
       AND column_name = 'trialDays') > 0,
    "ALTER TABLE plans DROP COLUMN trialDays",
    "SELECT 'Column trialDays does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Remove trialEnabled column if exists
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'plans'
       AND column_name = 'trialEnabled') > 0,
    "ALTER TABLE plans DROP COLUMN trialEnabled",
    "SELECT 'Column trialEnabled does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SELECT '============================================' AS '';
SELECT 'Catalogue changes rollback completed' AS status;
SELECT '============================================' AS '';
