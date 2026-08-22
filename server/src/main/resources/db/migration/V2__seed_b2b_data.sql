-- =============================================================================
-- ContractPulse CRM Enterprise — Seed B2B Accounts & Contracts Data (V2)
-- =============================================================================

-- 1. Insert Enterprise Accounts
INSERT INTO accounts (id, corporate_name, domain, logo_url, tax_id, industry, tier, annual_revenue, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'Cloudflare Inc.', 'cloudflare.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'US-77889911', 'CYBERSECURITY', 'ENTERPRISE', 1450000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'Stripe, Inc.', 'stripe.com', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80', 'US-11223344', 'FINTECH', 'ENTERPRISE_PLUS', 3200000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000003', 'Datadog, Inc.', 'datadoghq.com', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80', 'US-99887766', 'CLOUD_OBSERVABILITY', 'ENTERPRISE', 2130000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000004', 'Snowflake Inc.', 'snowflake.com', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80', 'US-55443322', 'DATA_PLATFORM', 'ENTERPRISE_PLUS', 2800000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000005', 'MongoDB, Inc.', 'mongodb.com', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80', 'US-33445566', 'DATABASE_SYSTEMS', 'ENTERPRISE', 1680000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000006', 'Figma, Inc.', 'figma.com', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&auto=format&fit=crop&q=80', 'US-66778899', 'DESIGN_SAAS', 'ENTERPRISE', 600000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000007', 'HashiCorp, Inc.', 'hashicorp.com', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&auto=format&fit=crop&q=80', 'US-22334455', 'DEVOPS_INFRASTRUCTURE', 'ENTERPRISE', 580000000.00, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000008', 'Vercel Inc.', 'vercel.com', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=80', 'US-44556677', 'FRONTEND_CLOUD', 'GROWTH_ENTERPRISE', 250000000.00, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Key Stakeholder Contacts
INSERT INTO contacts (id, account_id, full_name, email, phone, job_title, role_type, linkedin_url, avatar_url, is_primary) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'John Graham', 'john.graham@cloudflare.com', '+1 (888) 993-5273', 'VP of Engineering', 'DECISION_MAKER', 'https://linkedin.com/in/johngraham', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', TRUE),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Maya Rodriguez', 'maya.rodriguez@cloudflare.com', '+1 (888) 993-5274', 'Senior Legal Counsel', 'LEGAL_COUNSEL', 'https://linkedin.com/in/mayarodriguez', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', FALSE),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Alex Morgan', 'alex.morgan@cloudflare.com', '+1 (888) 993-5275', 'Procurement Manager', 'PROCUREMENT', 'https://linkedin.com/in/alexmorgan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', FALSE),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Patrick Collison', 'patrick@stripe.com', '+1 (415) 555-0199', 'Chief Executive Officer', 'DECISION_MAKER', 'https://linkedin.com/in/patrickcollison', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', TRUE),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'Olivier Pomel', 'olivier@datadoghq.com', '+1 (212) 555-0144', 'CTO & Co-Founder', 'DECISION_MAKER', 'https://linkedin.com/in/olivierpomel', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert B2B Contracts
INSERT INTO contracts (id, account_id, contract_number, title, total_value, monthly_value, billing_term, start_date, end_date, status, auto_renew, owner_name, owner_avatar) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CTR-2026-8941', 'Master Services Agreement — Cloudflare Inc', 240000.00, 20000.00, 'ANNUAL', '2025-03-15', '2026-03-15', 'ACTIVE', TRUE, 'Sarah Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'CTR-2026-9210', 'Global Payment Infrastructure Tier 1 — Stripe', 480000.00, 40000.00, 'ANNUAL', '2025-07-22', '2026-07-22', 'ACTIVE', TRUE, 'Michael Torres', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'CTR-2026-7832', 'Observability Enterprise Suite — Datadog', 180000.00, 15000.00, 'ANNUAL', '2025-02-10', '2026-02-10', 'IN_REVIEW', FALSE, 'Emily Johnson', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'CTR-2026-6541', 'Data Cloud Platform SLA Agreement — Snowflake', 360000.00, 30000.00, 'ANNUAL', '2025-05-05', '2026-05-05', 'ACTIVE', TRUE, 'David Kim', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'CTR-2026-4412', 'Atlas Database Enterprise Agreement — MongoDB', 120000.00, 10000.00, 'ANNUAL', '2025-04-30', '2026-04-30', 'EXPIRING_SOON', TRUE, 'Jessica Lee', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'CTR-2026-3390', 'Design System Enterprise License — Figma', 150000.00, 12500.00, 'ANNUAL', '2025-09-01', '2026-09-01', 'ACTIVE', TRUE, 'Sarah Chen', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'CTR-2026-2180', 'Infrastructure as Code Enterprise — HashiCorp', 210000.00, 17500.00, 'ANNUAL', '2025-11-15', '2026-11-15', 'ACTIVE', TRUE, 'Michael Torres', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'CTR-2026-1044', 'Edge Network & Next.js Acceleration — Vercel', 95000.00, 7916.66, 'ANNUAL', '2026-01-10', '2027-01-10', 'DRAFT', FALSE, 'Emily Johnson', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Contract Amendments (Audit History)
INSERT INTO contract_amendments (id, contract_id, amendment_title, value_delta, effective_date, author_name, description) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Contract Activated', 0.00, '2025-03-15', 'Sarah Chen', 'Original Master Services Agreement went live.'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Amendment #2 — Cloudflare Spectrum', 40000.00, '2025-01-20', 'Maya Rodriguez', 'Added Cloudflare Spectrum and Magic Transit enterprise protection.'),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Amendment #1 — R2 Storage Expansion', 20000.00, '2024-10-05', 'Maya Rodriguez', 'Increased rate limit quota and added R2 object storage integration.'),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Contract Signed', 0.00, '2024-03-01', 'John Graham', 'Initial contract signed by executive leadership.')
ON CONFLICT (id) DO NOTHING;
