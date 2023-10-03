export interface Company {
  accounts?: CompanyAccounts;
  annual_return?: AnnualReturn;
  branch_company_details?: BranchCompanyDetails;
  can_file: boolean;
  company_name: string;
  company_number: string;
  company_status: CompanyStatus;
  company_status_detail?: CompanyStatusDetail;
  confirmation_statement?: ConfirmationStatement;
  date_of_cessation?: Date;
  date_of_creation: Date;
  etag?: string;
  foreign_company_details?: ForeignCompanyDetails;
  has_been_liquidated?: boolean;
  has_charges?: boolean;
  has_insolvency_history?: boolean;
  has_super_secure_pscs?: boolean;
  is_community_interest_company?: boolean;
  jurisdiction: Jurisdiction;
  last_full_members_list_date?: Date;
  links: Links;
  previous_company_names?: PreviousCompanyName[];
  registered_office_address?: RegisteredOfficeAddress;
  registered_office_is_in_dispute?: boolean;
  service_address?: ServiceAddress;
  sic_codes?: string[];
  super_secure_managing_officer_count?: number;
  type: CompanyType;
  subtype?: CompanySubtype;
  undeliverable_registered_office_address?: boolean;
}

export type CompanyAccounts = {
  accounting_reference_date: {
    day: number;
    month: number;
  };
  last_accounts?: {
    made_up_to: Date;
    type: CompanyAccountsType;
  };
  next_due?: Date;
  next_made_up_to: Date;
  overdue: boolean;
};

export type CompanyAccountsType =
  | 'full'
  | 'small'
  | 'medium'
  | 'group'
  | 'dormant'
  | 'interim'
  | 'initial'
  | 'total-exemption-full'
  | 'total-exemption-small'
  | 'partial-exemption'
  | 'audit-exemption-subsidiary'
  | 'filing-exemption-subsidiary'
  | 'micro-entity'
  | 'no-accounts-type-available'
  | 'audited-abridged'
  | 'unaudited-abridged';

type AnnualReturn = {
  last_made_up_to?: Date;
  next_due?: Date;
  next_made_up_to?: Date;
  overdue?: boolean;
};

type BranchCompanyDetails = {
  business_activity?: string;
  parent_company_name?: string;
  parent_company_number?: string;
};

type CompanyStatus =
  | 'active'
  | 'dissolved'
  | 'liquidation'
  | 'receivership'
  | 'administration'
  | 'voluntary-arrangement'
  | 'converted-closed'
  | 'insolvency-proceedings'
  | 'registered'
  | 'removed'
  | 'closed'
  | 'open';

type CompanyStatusDetail =
  | 'transferred-from-uk'
  | 'active-proposal-to-strike-off'
  | 'petition-to-restore-dissolved'
  | 'transformed-to-se'
  | 'converted-to-plc';

type ConfirmationStatement = {
  last_made_up_to?: Date;
  next_due: Date;
  next_made_up_to: Date;
  overdue?: boolean;
};

type ForeignCompanyDetails = {
  accounting_requirement?: ForeignCompanyAccountingRequirement;
  accounts?: ForeignAccounts;
  business_activity?: string;
  company_type?: string;
  governed_by?: string;
  is_a_credit_finance_institution?: boolean;
  originating_registry?: ForeignCompanyOriginatingRegistry;
  registration_number?: string;
};

type ForeignCompanyAccountingRequirement = {
  foreign_account_type?: ForeignCompanyAccountType;
  terms_of_account_publication?: ForeignCompanyTermsOfAccountPublication;
};

type ForeignCompanyAccountType =
  | 'accounting-requirement-of-originating-country-apply'
  | 'accounting-requirement-of-originating-country-do-not-apply';

type ForeignCompanyTermsOfAccountPublication =
  | 'accounts-publication-date-supplied-by-company'
  | 'accounting-publication-date-does-not-need-to-be-supplied-by-company'
  | 'accounting-reference-date-allocated-by-companies-house';

type ForeignAccounts = {
  account_period_from?: {
    day?: number;
    month?: number;
  };
  account_period_to?: {
    day?: number;
    month?: number;
  };
  must_file_within?: {
    months?: number;
  };
};

type ForeignCompanyOriginatingRegistry = {
  country: string;
  name: string;
};

type Jurisdiction =
  | 'england-wales'
  | 'wales'
  | 'scotland'
  | 'northern-ireland'
  | 'european-union'
  | 'united-kingdom'
  | 'england'
  | 'noneu';

type Links = {
  persons_with_significant_control?: string;
  persons_with_significant_control_statements?: string;
  registers?: string;
  self: string;
};

export type PreviousCompanyName = {
  ceased_on: Date;
  effective_from: Date;
  name: string;
};

type RegisteredOfficeAddress = {
  care_of?: string;
  premises?: string;
  po_box?: string;
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
};

type ServiceAddress = {
  address_line_1?: string;
  address_line_2?: string;
  care_of?: string;
  country?: string;
  locality?: string;
  po_box?: string;
  postal_code?: string;
  region?: string;
};

type CompanyType =
  | 'private-unlimited'
  | 'ltd'
  | 'plc'
  | 'old-public-company'
  | 'private-limited-guarant-nsc-limited-exemption'
  | 'limited-partnership'
  | 'private-limited-guarant-nsc'
  | 'converted-or-closed'
  | 'private-unlimited-nsc'
  | 'private-limited-shares-section-30-exemption'
  | 'protected-cell-company'
  | 'assurance-company'
  | 'oversea-company'
  | 'eeig'
  | 'icvc-securities'
  | 'icvc-warrant'
  | 'icvc-umbrella'
  | 'registered-society-non-jurisdictional'
  | 'industrial-and-provident-society'
  | 'northern-ireland'
  | 'northern-ireland-other'
  | 'royal-charter'
  | 'investment-company-with-variable-capital'
  | 'unregistered-company'
  | 'llp'
  | 'other'
  | 'european-public-limited-liability-company-se'
  | 'uk-establishment'
  | 'scottish-partnership'
  | 'charitable-incorporated-organisation'
  | 'scottish-charitable-incorporated-organisation'
  | 'further-education-or-sixth-form-college-corporation'
  | 'registered-overseas-entity'
  | 'ukeig'
  | 'united-kingdom-societas';

type CompanySubtype =
  | 'community-interest-company'
  | 'private-fund-limited-partnership';
