-- =============================================
-- Migration: Create Subscriptions Table
-- Database: subscription_db
-- Date: 2025-01-26
-- Description: Create main subscriptions table for SaaS model
-- =============================================

USE subscription_db;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customerId INT NOT NULL,
    planId INT NOT NULL,
    status ENUM('trial', 'active', 'past_due', 'cancelled', 'paused') NOT NULL DEFAULT 'trial',
    
    -- Trial period tracking
    trialStart TIMESTAMP NULL,
    trialEnd TIMESTAMP NULL,
    isTrialUsed BOOLEAN DEFAULT FALSE,
    
    -- Subscription period
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP NULL,
    currentPeriodStart TIMESTAMP NOT NULL,
    currentPeriodEnd TIMESTAMP NOT NULL,
    
    -- Cancellation tracking
    cancelAtPeriodEnd BOOLEAN DEFAULT FALSE,
    cancelledAt TIMESTAMP NULL,
    cancellationReason TEXT NULL,
    
    -- Metadata
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_customer (customerId),
    INDEX idx_plan (planId),
    INDEX idx_status (status),
    INDEX idx_period_end (currentPeriodEnd),
    INDEX idx_trial_end (trialEnd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments
ALTER TABLE subscriptions 
    COMMENT = 'Main subscriptions table for SaaS subscription model';

-- Verify table creation
SELECT 
    'Subscriptions table created successfully' AS status,
    COUNT(*) AS row_count 
FROM subscriptions;
