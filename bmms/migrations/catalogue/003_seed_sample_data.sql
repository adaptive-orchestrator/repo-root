-- Sample features
INSERT INTO features (id, name, description, code, createdAt, updatedAt) VALUES
  (1, 'Task Management', 'Create and manage unlimited tasks', 'FEAT001', NOW(), NOW()),
  (2, 'Team Collaboration', 'Share tasks with team members', 'FEAT002', NOW(), NOW()),
  (3, 'Advanced Analytics', 'Detailed insights and reports', 'FEAT003', NOW(), NOW()),
  (4, 'Priority Support', '24/7 priority customer support', 'FEAT004', NOW(), NOW()),
  (5, 'API Access', 'Full REST API access', 'FEAT005', NOW(), NOW()),
  (6, 'Custom Branding', 'White-label your workspace', 'FEAT006', NOW(), NOW());

-- Sample plans
INSERT INTO plans (id, name, description, price, billingCycle, trialEnabled, trialDays, createdAt, updatedAt) VALUES
  (1, 'Basic', 'Perfect for individuals', 9.99, 'monthly', FALSE, 0, NOW(), NOW()),
  (2, 'Professional', 'For growing teams', 29.99, 'monthly', TRUE, 14, NOW(), NOW()),
  (3, 'Enterprise', 'For large organizations', 99.99, 'monthly', TRUE, 30, NOW(), NOW());

-- Sample plan_features (many-to-many)
INSERT INTO plan_features (planId, featureId) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 2), (2, 3), (2, 5),
  (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6);
