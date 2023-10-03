import { Company } from '../../types/company.js';
import { RecursivePartial } from '../../util/types.js';

export type Product183Company = RecursivePartial<
  Pick<
    Company,
    | 'accounts'
    | 'company_status'
    | 'confirmation_statement'
    | 'date_of_creation'
    | 'jurisdiction'
    | 'type'
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
    | 'last_full_members_list_date'
    | 'previous_company_names'
    | 'registered_office_is_in_dispute'
    | 'service_address'
    | 'sic_codes'
    | 'super_secure_managing_officer_count'
    | 'undeliverable_registered_office_address'
    // Fields that are partial in the product 183 data
    | 'accounts'
    | 'company_status'
    | 'confirmation_statement'
    | 'date_of_creation'
    | 'jurisdiction'
    | 'type'
  >;
