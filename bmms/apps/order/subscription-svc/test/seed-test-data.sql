-- =============================================
-- Test Data Seeder for E2E Tests
-- Run this before E2E testing
-- =============================================

-- =============================================
-- 1. CUSTOMER DATA
-- =============================================
USE customer_db;

-- Clear existing test data
DELETE FROM customers WHERE id BETWEEN 1 AND 10;

-- Insert test customers
INSERT INTO customers (id, email, name, phone, createdAt, updatedAt) VALUES
(1, 'test1@example.com', 'Test Customer 1', '0123456789', NOW(), NOW()),
(2, 'test2@example.com', 'Test Customer 2', '0987654321', NOW(), NOW()),
(3, 'test3@example.com', 'Test Customer 3', '0111222333', NOW(), NOW());

SELECT 'Customers created' AS status, COUNT(*) as count FROM customers WHERE id BETWEEN 1 AND 10;

-- =============================================
-- 2. CATALOGUE DATA (Plans)
-- =============================================
USE catalogue_db;

-- Clear existing test plans
DELETE FROM plans WHERE id BETWEEN 1 AND 10;

-- Insert test plans
INSERT INTO plans (id, name, description, price, billingCycle, trialEnabled, trialDays, features, createdAt, updatedAt) VALUES
(1, 'Basic Plan', 'Perfect for individuals', 29.99, 'monthly', TRUE, 14, 
 JSON_ARRAY('5 projects', '10GB storage', 'Email support'), NOW(), NOW()),

(2, 'Pro Plan', 'For growing teams', 49.99, 'monthly', TRUE, 14,
 JSON_ARRAY('Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics'), NOW(), NOW()),

(3, 'Enterprise Plan', 'For large organizations', 99.99, 'monthly', FALSE, 0,
 JSON_ARRAY('Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee'), NOW(), NOW()),

(4, 'Annual Basic', 'Basic plan billed yearly', 299.00, 'yearly', TRUE, 30,
 JSON_ARRAY('5 projects', '10GB storage', 'Email support', '2 months free'), NOW(), NOW()),

(5, 'Annual Pro', 'Pro plan billed yearly', 499.00, 'yearly', TRUE, 30,
 JSON_ARRAY('Unlimited projects', '100GB storage', 'Priority support', '2 months free'), NOW(), NOW());

SELECT 'Plans created' AS status, COUNT(*) as count FROM plans WHERE id BETWEEN 1 AND 10;

-- =============================================
-- 3. PROMOTION DATA
-- =============================================
USE promotion_db;

-- Clear existing test promotions
DELETE FROM promotions WHERE code LIKE 'TEST%';
DELETE FROM promotion_usage WHERE promotionId IN (SELECT id FROM promotions WHERE code LIKE 'TEST%');

-- Insert test promotions
INSERT INTO promotions (
  code, name, description, type, discountValue, trialExtensionDays, freeMonths,
  applicableTo, specificPlanIds, status, 
  maxUses, currentUses, maxUsesPerCustomer,
  validFrom, validUntil,
  minPurchaseAmount, isFirstTimeOnly, isRecurring,
  createdAt, updatedAt
) VALUES
-- Percentage discount
('TEST50', 'Test 50% Off', '50% discount for testing', 'percentage', 50, NULL, NULL,
 'all_plans', NULL, 'active',
 100, 0, 5,
 NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY),
 0, FALSE, FALSE,
 NOW(), NOW()),

-- Fixed amount discount
('SAVE10', 'Save $10', '$10 off any plan', 'fixed_amount', 10, NULL, NULL,
 'all_plans', NULL, 'active',
 50, 0, 1,
 NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY),
 20, FALSE, FALSE,
 NOW(), NOW()),

-- Trial extension
('TRIAL30', 'Extended Trial', 'Get 16 extra trial days', 'trial_extension', NULL, 16, NULL,
 'all_plans', NULL, 'active',
 200, 0, 1,
 NOW(), DATE_ADD(NOW(), INTERVAL 120 DAY),
 0, TRUE, FALSE,
 NOW(), NOW()),

-- Free months
('ANNUAL2FREE', 'Annual Bonus', 'Get 2 months free on annual plans', 'free_months', NULL, NULL, 2,
 'specific_plans', JSON_ARRAY(4, 5), 'active',
 100, 0, 1,
 NOW(), DATE_ADD(NOW(), INTERVAL 180 DAY),
 100, FALSE, TRUE,
 NOW(), NOW()),

-- Expired promotion (for testing)
('EXPIRED', 'Expired Promo', 'This has expired', 'percentage', 20, NULL, NULL,
 'all_plans', NULL, 'expired',
 10, 5, 1,
 DATE_SUB(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY),
 0, FALSE, FALSE,
 NOW(), NOW());

SELECT 'Promotions created' AS status, COUNT(*) as count FROM promotions WHERE code LIKE 'TEST%' OR code IN ('SAVE10', 'TRIAL30', 'ANNUAL2FREE', 'EXPIRED');

-- =============================================
-- 4. CLEAR EXISTING TEST SUBSCRIPTIONS
-- =============================================
USE subscription_db;

-- Clear test subscriptions (customer IDs 1-10)
DELETE FROM subscription_history WHERE subscriptionId IN (
  SELECT id FROM subscriptions WHERE customerId BETWEEN 1 AND 10
);
DELETE FROM subscriptions WHERE customerId BETWEEN 1 AND 10;

SELECT 'Subscriptions cleared' AS status;

-- =============================================
-- 5. CLEAR EXISTING TEST INVOICES
-- =============================================
USE billing_db;

-- Clear test invoices
DELETE FROM invoices WHERE customerId BETWEEN 1 AND 10;

SELECT 'Invoices cleared' AS status;

-- =============================================
-- 6. VERIFICATION
-- =============================================

-- Summary
SELECT '============================================' AS '';
SELECT 'TEST DATA SEEDING COMPLETED' AS status;
SELECT '============================================' AS '';

SELECT 'Customers' as table_name, COUNT(*) as count FROM customer_db.customers WHERE id BETWEEN 1 AND 10
UNION ALL
SELECT 'Plans' as table_name, COUNT(*) as count FROM catalogue_db.plans WHERE id BETWEEN 1 AND 10
UNION ALL
SELECT 'Promotions' as table_name, COUNT(*) as count FROM promotion_db.promotions WHERE code LIKE 'TEST%' OR code IN ('SAVE10', 'TRIAL30', 'ANNUAL2FREE', 'EXPIRED')
UNION ALL
SELECT 'Subscriptions' as table_name, COUNT(*) as count FROM subscription_db.subscriptions WHERE customerId BETWEEN 1 AND 10
UNION ALL
SELECT 'Invoices' as table_name, COUNT(*) as count FROM billing_db.invoices WHERE customerId BETWEEN 1 AND 10;

-- Show test customers
SELECT '============================================' AS '';
SELECT 'TEST CUSTOMERS:' AS '';
SELECT id, email, name FROM customer_db.customers WHERE id BETWEEN 1 AND 10;

-- Show test plans
SELECT '============================================' AS '';
SELECT 'TEST PLANS:' AS '';
SELECT id, name, price, billingCycle, trialEnabled, trialDays FROM catalogue_db.plans WHERE id BETWEEN 1 AND 10;

-- Show test promotions
SELECT '============================================' AS '';
SELECT 'TEST PROMOTIONS:' AS '';
SELECT code, name, type, discountValue, status, validUntil FROM promotion_db.promotions WHERE code LIKE 'TEST%' OR code IN ('SAVE10', 'TRIAL30', 'ANNUAL2FREE', 'EXPIRED');

SELECT '============================================' AS '';
SELECT '✅ Ready for E2E testing!' AS status;
SELECT '============================================' AS '';

-- Quick start guide
SELECT 'RUN E2E TESTS:' AS '';
SELECT '1. Start all services: npm run start:dev' AS step;
SELECT '2. Run test script: node test/run-e2e-tests.js' AS step;
SELECT '3. Or manual tests: See test/E2E-TEST-GUIDE.md' AS step;
