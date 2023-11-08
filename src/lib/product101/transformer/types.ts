import { Company } from '../../types/company.js';
import { RecursivePartial } from '../../util/types.js';

export type CompanyTransaction =
  | CompanyIncorporationTransaction
  | CompanyAddTransaction
  | CompanyRestorationTransaction
  | CompanyAccountingReferenceDateTransaction
  | CompanyAccountsMadeUpDateTransaction
  | CompanyConfirmationStatementMadeUpDateTransaction
  | CompanyNameTransaction
  | CompanyAddressTransaction
  | CompanyAccountsTransaction
  | CompanyVoluntaryArrangementTransaction
  | CompanyDateOfIncorporationTransaction
  | CompanyInspectMarkerTransaction
  | CompanyGazettableDocumentTypeNotOtherwiseIncludedTransaction
  | CompanyConvertedClosedTransaction
  | CompanyDissolutionFirstGazetteTransaction
  | CompanyDissolutionFinalGazetteTransaction
  | CompanyDeleteTransaction
  | CompanySICCodesTransaction
  | CompanyCountryOfOriginCodeTransaction
  | CompanyFullMembersListTransaction
  | CompanyVoluntaryDissolutionIndicatorTransaction
  | CompanyConversionBetweenPLCAndSETransaction
  | CompanyGazettableDocumentsSubmittedBySubsidiaryTransaction
  | CompanySubsidiaryCompanyExemptionFromAuditOrFilingAccountsTransaction
  | CompanyJurisdictionTransaction
  | CompanyConfirmationStatementDateTransaction
  | CompanyDesignationAsPrivateFundLimitedPartnershipTransaction
  | CompanyTypeTransaction
  | NoLongerUsedTransaction;

type BaseTransaction = {
  gazette?: {
    document_type?: string;
    date?: Date;
  };
  transaction_id: string;
  jurisdiction?: Company['jurisdiction'];
  received_date?: Date;
  company_number: Company['company_number'];
  correction?: 'companies-house-correction' | 'errored-transaction';
};

type CompanyIncorporationTransaction = BaseTransaction & {
  type: 'incorporation';
  data: Pick<Company, 'company_name' | 'company_number'> &
    Pick<
      RecursivePartial<Company>,
      'accounts' | 'date_of_creation' | 'registered_office_address' | 'type'
    >;
};

type CompanyAddTransaction = BaseTransaction & {
  type: 'add';
  data: Pick<Company, 'company_name' | 'company_number'> &
    Pick<
      RecursivePartial<Company>,
      | 'accounts'
      | 'company_status'
      | 'company_status_detail'
      | 'confirmation_statement'
      | 'date_of_creation'
      | 'registered_office_address'
      | 'type'
    >;
};

type CompanyRestorationTransaction = BaseTransaction & {
  type: 'restoration';
  data: Pick<Company, 'company_name' | 'company_number'> &
    Pick<
      RecursivePartial<Company>,
      | 'accounts'
      | 'company_status'
      | 'company_status_detail'
      | 'confirmation_statement'
      | 'date_of_creation'
      | 'registered_office_address'
      | 'type'
    >;
};

type CompanyTypeTransaction = BaseTransaction & {
  type: 'type';
  data: Pick<RecursivePartial<Company>, 'type'>;
};

type CompanyAccountsMadeUpDateTransaction = BaseTransaction & {
  type: 'accounts-made-up-date';
  data: Pick<RecursivePartial<Company>, 'accounts'>;
};

type CompanyConfirmationStatementMadeUpDateTransaction = BaseTransaction & {
  type: 'confirmation-statement-made-up-date';
  data: Pick<RecursivePartial<Company>, 'confirmation_statement'>;
};

type CompanyAccountingReferenceDateTransaction = BaseTransaction & {
  type: 'accounting-reference-date';
  data: Pick<RecursivePartial<Company>, 'accounts'>;
};

type CompanyNameTransaction = BaseTransaction & {
  type: 'name';
  data: Pick<Company, 'company_name'>;
};

type CompanyAddressTransaction = BaseTransaction & {
  type: 'address';
  data: Pick<Company, 'registered_office_address'>;
};

type NoLongerUsedTransaction = BaseTransaction & {
  type: 'no-longer-used';
};

type CompanyAccountsTransaction = BaseTransaction & {
  type: 'accounts';
  data: Pick<RecursivePartial<Company>, 'accounts'>;
};

type CompanyVoluntaryArrangementTransaction = BaseTransaction & {
  type: 'voluntary-arrangement';
  data: Pick<Company, 'company_status'>;
};

type CompanyDateOfIncorporationTransaction = BaseTransaction & {
  type: 'date-of-incorporation';
  data: Pick<RecursivePartial<Company>, 'date_of_creation'>;
};

type CompanyInspectMarkerTransaction = BaseTransaction & {
  type: 'inspect-marker';
  data: Pick<
    RecursivePartial<Company>,
    'company_status' | 'company_status_detail'
  >;
};

type CompanyGazettableDocumentTypeNotOtherwiseIncludedTransaction =
  BaseTransaction & {
    type: 'gazettable-document-type-not-otherwise-included';
  };

type CompanyConvertedClosedTransaction = BaseTransaction & {
  type: 'converted-closed';
  data: Pick<Company, 'company_status'>;
};

type CompanyDissolutionFirstGazetteTransaction = BaseTransaction & {
  type: 'dissolution-first-gazette';
};

type CompanyDissolutionFinalGazetteTransaction = BaseTransaction & {
  type: 'dissolution';
  data: Pick<Company, 'company_status'>;
};

type CompanyDeleteTransaction = BaseTransaction & {
  type: 'delete';
};

type CompanySICCodesTransaction = BaseTransaction & {
  type: 'sic-codes';
  data: Pick<Company, 'sic_codes'>;
};

// TODO work this one out
type CompanyCountryOfOriginCodeTransaction = BaseTransaction & {
  type: 'country-of-origin-code';
};

type CompanyFullMembersListTransaction = BaseTransaction & {
  type: 'full-members-list';
  data: Pick<
    RecursivePartial<Company>,
    'confirmation_statement' | 'last_full_members_list_date'
  >;
};

type CompanyVoluntaryDissolutionIndicatorTransaction = BaseTransaction & {
  type: 'voluntary-dissolution-indicator';
};

type CompanyConversionBetweenPLCAndSETransaction = BaseTransaction & {
  type: 'conversion-between-plc-and-se';
  data: Pick<Company, 'company_status_detail'>;
};

type CompanyGazettableDocumentsSubmittedBySubsidiaryTransaction =
  BaseTransaction & {
    type: 'gazettable-documents-submitted-by-subsidiary';
    data: Pick<RecursivePartial<Company>, 'accounts'>;
  };

type CompanySubsidiaryCompanyExemptionFromAuditOrFilingAccountsTransaction =
  BaseTransaction & {
    type: 'subsidiary-company-exemption-from-audit-or-filing-accounts';
    data: Pick<RecursivePartial<Company>, 'accounts'>;
  };

type CompanyJurisdictionTransaction = BaseTransaction & {
  type: 'jurisdiction';
  data: Pick<RecursivePartial<Company>, 'jurisdiction'>;
};

type CompanyConfirmationStatementDateTransaction = BaseTransaction & {
  type: 'confirmation-statement-date';
  data: Pick<RecursivePartial<Company>, 'confirmation_statement'>;
};

type CompanyDesignationAsPrivateFundLimitedPartnershipTransaction =
  BaseTransaction & {
    type: 'designation-as-private-fund-limited-partnership';
    data: Pick<Company, 'subtype'>;
  };
