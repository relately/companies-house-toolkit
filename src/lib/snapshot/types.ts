import { BatchOperation, Level } from 'level';
import { Company } from '../types/company.js';
import { RecursivePartial } from '../util/types.js';

export type SnapshotCompany = RecursivePartial<
  Pick<
    Company,
    | 'accounts'
    | 'company_status'
    | 'confirmation_statement'
    | 'date_of_creation'
    | 'jurisdiction'
    | 'type'
    | 'links'
  >
> &
  Omit<
    Company,
    // Fields that are not possible to determine from the product 183 data
    | 'annual_return'
    | 'branch_company_details'
    | 'can_file'
    | 'date_of_cessation'
    | 'etag'
    | 'foreign_company_details'
    | 'has_been_liquidated'
    | 'has_charges'
    | 'has_insolvency_history'
    | 'has_super_secure_pscs'
    | 'is_community_interest_company'
    | 'registered_office_is_in_dispute'
    | 'service_address'
    | 'super_secure_managing_officer_count'
    | 'undeliverable_registered_office_address'
    // Fields that are partial in the product 183 data
    | 'accounts'
    | 'company_status'
    | 'confirmation_statement'
    | 'date_of_creation'
    | 'jurisdiction'
    | 'type'
    | 'links'
  >;

export type CompanySnapshotDB = Level<string, SnapshotCompany>;

export type CompanySnapshotDBBatchOperation = BatchOperation<
  CompanySnapshotDB,
  string,
  SnapshotCompany
>;

export type CompanySnapshotAddOperation = {
  type: 'add';
  key: string;
  value: SnapshotCompany;
};

export type CompanySnapshotUpdateOperation = {
  type: 'update';
  key: string;
  value: RecursivePartial<SnapshotCompany>;
};

export type CompanySnapshotDeleteOperation = {
  type: 'delete';
  key: string;
};

export type CompanySnapshotOperation =
  | CompanySnapshotAddOperation
  | CompanySnapshotUpdateOperation
  | CompanySnapshotDeleteOperation;
