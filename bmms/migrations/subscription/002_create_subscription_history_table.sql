-- =============================================
-- Migration: Create Subscription History Table
-- Database: subscription_db
-- Date: 2025-01-26
-- Description: Audit trail for all subscription changes
-- =============================================

USE subscription_db;

-- Create subscription_history table
CREATE TABLE IF NOT EXISTS subscription_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subscriptionId INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    previousValue TEXT NULL,
    newValue TEXT NULL,
    reason TEXT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (subscriptionId) REFERENCES subscriptions(id) 
        ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_subscription (subscriptionId),
    INDEX idx_action (action),
    INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments
ALTER TABLE subscription_history 
    COMMENT = 'Audit trail for subscription lifecycle changes';

-- Verify table creation
SELECT 
    'Subscription history table created successfully' AS status,
    COUNT(*) AS row_count 
FROM subscription_history;
