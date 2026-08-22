-- =============================================================================
-- ContractPulse CRM Enterprise — Initial Schema Migration (V1)
-- PostgreSQL 17 Dialect
-- =============================================================================

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    tax_id VARCHAR(100),
    industry VARCHAR(100) NOT NULL DEFAULT 'TECHNOLOGY',
    tier VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    annual_revenue NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    job_title VARCHAR(150),
    role_type VARCHAR(50) NOT NULL DEFAULT 'DECISION_MAKER',
    linkedin_url VARCHAR(500),
    avatar_url VARCHAR(500),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    total_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    monthly_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    billing_term VARCHAR(50) NOT NULL DEFAULT 'ANNUAL',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    owner_name VARCHAR(255) NOT NULL,
    owner_avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contract_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    amendment_title VARCHAR(255) NOT NULL,
    value_delta NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    effective_date DATE NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_account_id ON contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_contracts_account_id ON contracts(account_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_amendments_contract_id ON contract_amendments(contract_id);
