-- =============================================
-- Rollback Script - Billing Changes
-- Database: billing_db
-- Date: 2025-01-26
-- Description: Remove subscription columns from invoices
-- =============================================

USE billing_db;

-- Drop indexes first
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND index_name = 'idx_invoice_type') > 0,
    "DROP INDEX idx_invoice_type ON invoices",
    "SELECT 'Index idx_invoice_type does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND index_name = 'idx_subscription') > 0,
    "DROP INDEX idx_subscription ON invoices",
    "SELECT 'Index idx_subscription does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Remove columns
SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND column_name = 'periodEnd') > 0,
    "ALTER TABLE invoices DROP COLUMN periodEnd",
    "SELECT 'Column periodEnd does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND column_name = 'periodStart') > 0,
    "ALTER TABLE invoices DROP COLUMN periodStart",
    "SELECT 'Column periodStart does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND column_name = 'subscriptionId') > 0,
    "ALTER TABLE invoices DROP COLUMN subscriptionId",
    "SELECT 'Column subscriptionId does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SET @preparedStatement = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
     WHERE table_schema = DATABASE()
       AND table_name = 'invoices'
       AND column_name = 'invoiceType') > 0,
    "ALTER TABLE invoices DROP COLUMN invoiceType",
    "SELECT 'Column invoiceType does not exist' AS msg"
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

SELECT '============================================' AS '';
SELECT 'Billing changes rollback completed' AS status;
SELECT '============================================' AS '';
