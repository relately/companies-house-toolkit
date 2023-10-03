import { FormatterType, Through } from '../convert.js';
import { formatCsv } from '../formatters/csv.js';
import { formatJson } from '../formatters/json.js';
import { SnapshotCompany } from './types.js';

export const formatCompanySnapshot = (
  type: FormatterType
): Through<SnapshotCompany, string> => {
  switch (type) {
    case 'json':
      return formatJson();
    case 'csv':
      return formatCsv([
        'company_number',
        'company_name',
        'type',
        'subtype',
        'company_status',
        'company_status_detail',
        'date_of_creation',
        'jurisdiction',
        'accounts.next_made_up_to',
        'accounts.last_accounts.made_up_to',
        'accounts.last_accounts.type',
        'accounts.accounting_reference_date.day',
        'accounts.accounting_reference_date.month',
        'confirmation_statement.last_made_up_to',
        'registered_office_address.care_of',
        'registered_office_address.po_box',
        'registered_office_address.premises',
        'registered_office_address.address_line_1',
        'registered_office_address.address_line_2',
        'registered_office_address.locality',
        'registered_office_address.region',
        'registered_office_address.postal_code',
        'registered_office_address.country',
        'voluntary-dissolution-indicator',
        'last_full_members_list_date',
        'sic_codes.0',
        'sic_codes.1',
        'sic_codes.2',
        'sic_codes.3',
        'links.self',
      ]);
  }
};
