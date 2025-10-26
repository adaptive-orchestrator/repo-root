-- Migration: Make productId nullable in invoice_items table
-- Reason: Recurring invoices (subscriptions) don't have productId

USE billing_db;

-- Make productId nullable
ALTER TABLE invoice_items 
MODIFY COLUMN productId INT NULL;

-- Add index for better query performance
CREATE INDEX idx_invoice_items_productId ON invoice_items(productId);
