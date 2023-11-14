import { Company } from '../../../types/company.js';
import { RecursivePartial } from '../../../util/types.js';

export type Product217Company = RecursivePartial<
  Pick<
    Company,
    | 'date_of_creation'
    | 'type'
    | 'accounts'
    | 'confirmation_statement'
    | 'previous_company_names'
  >
> &
  Omit<
    Company,
    // Fields that are not possible to determine from the product 217 data
    | 'undeliverable_registered_office_address'
    | 'branch_company_details'
    | 'can_file'
    | 'etag'
    | 'foreign_company_details'
    | 'has_been_liquidated'
    | 'has_insolvency_history'
    | 'has_super_secure_pscs'
    | 'jurisdiction'
    | 'last_full_members_list_date'
    | 'registered_office_is_in_dispute'
    | 'super_secure_managing_officer_count'
    // Fields that are partial in the product 217 data
    | 'date_of_creation'
    | 'type'
    | 'accounts'
    | 'confirmation_statement'
    | 'previous_company_names'
  >;
