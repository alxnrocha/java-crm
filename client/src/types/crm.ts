export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'CHURNED';
export type AccountTier = 'ENTERPRISE' | 'ENTERPRISE_PLUS' | 'GROWTH_ENTERPRISE' | 'SCALE';
export type Industry =
  | 'CYBERSECURITY'
  | 'FINTECH'
  | 'CLOUD_OBSERVABILITY'
  | 'DATA_PLATFORM'
  | 'DATABASE_SYSTEMS'
  | 'DESIGN_SAAS'
  | 'DEVOPS_INFRASTRUCTURE'
  | 'FRONTEND_CLOUD'
  | 'AI_ML'
  | 'ECOMMERCE'
  | 'HEALTHCARE'
  | 'OTHER';

export type ContractStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'RENEWED'
  | 'CANCELLED';

export type BillingTerm = 'ANNUAL' | 'MONTHLY' | 'QUARTERLY';

export type ContactRole =
  | 'DECISION_MAKER'
  | 'LEGAL_COUNSEL'
  | 'PROCUREMENT'
  | 'TECHNICAL_LEAD'
  | 'FINANCE';

export interface Contact {
  id: string;
  accountId: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  roleType: ContactRole;
  linkedinUrl?: string;
  avatarUrl?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  corporateName: string;
  domain: string;
  logoUrl?: string;
  taxId?: string;
  industry: Industry;
  tier: AccountTier;
  annualRevenue: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  contacts?: Contact[];
}

export interface ContractAmendment {
  id: string;
  contractId: string;
  amendmentTitle: string;
  valueDelta: number;
  effectiveDate: string;
  authorName: string;
  description?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  accountId: string;
  accountCorporateName: string;
  accountDomain: string;
  accountLogoUrl?: string;
  accountTier: AccountTier;
  contractNumber: string;
  title: string;
  totalValue: number;
  monthlyValue: number;
  billingTerm: BillingTerm;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  autoRenew: boolean;
  ownerName: string;
  ownerAvatar?: string;
  createdAt: string;
  updatedAt: string;
  amendments?: ContractAmendment[];
  contacts?: Contact[];
}

export interface KpiMetrics {
  totalArr: number;
  arrGrowthPercent: number;
  activeMrr: number;
  mrrTarget: number;
  mrrAttainmentPercent: number;
  expiringContractsCount: number;
  expiringArrAtRisk: number;
  netRetentionRate: number;
  nrrDeltaPercent: number;
  activeContractsCount: number;
  totalContractsCount: number;
}

export interface StatusDistribution {
  status: ContractStatus;
  label: string;
  count: number;
  percentage: number;
  totalArr: number;
  color: string;
}

export interface RevenueGrowthPoint {
  month: string;
  actualArr: number;
  targetArr: number;
  mrr: number;
}

export interface ExecutiveOverview {
  kpis: KpiMetrics;
  statusDistribution: StatusDistribution[];
  revenueGrowth: RevenueGrowthPoint[];
  totalContractsCount: number;
}

export interface ContractCreateInput {
  accountId: string;
  title: string;
  totalValue: number;
  billingTerm: BillingTerm;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  ownerName: string;
  ownerAvatar?: string;
}

export interface ContractUpdateInput {
  title: string;
  totalValue: number;
  billingTerm: BillingTerm;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  ownerName: string;
  ownerAvatar?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
