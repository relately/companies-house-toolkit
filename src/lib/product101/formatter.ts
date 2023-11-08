import { FormatterType, Through } from '../convert.js';
import { formatCsv } from '../formatters/csv.js';
import { formatJson } from '../formatters/json.js';
import { CompanyTransaction } from './transformer/types.js';

export const formatProduct101 = (
  type: FormatterType
): Through<CompanyTransaction, string> => {
  switch (type) {
    case 'json':
      return formatJson();
    case 'csv':
      return formatCsv([
        'type',
        'company_number',
        'transaction_id',
        'received_date',
        'jurisdiction',
        'correction',
        'gazette.document_type',
        'gazette.date',
        'data.company_number',
        'data.company_name',
        'data.type',
        'data.subtype',
        'data.company_status',
        'data.company_status_detail',
        'data.date_of_creation',
        'data.jurisdiction',
        'data.accounts.next_made_up_to',
        'data.accounts.last_accounts.made_up_to',
        'data.accounts.last_accounts.type',
        'data.accounts.accounting_reference_date.day',
        'data.accounts.accounting_reference_date.month',
        'data.confirmation_statement.last_made_up_to',
        'data.registered_office_address.care_of',
        'data.registered_office_address.po_box',
        'data.registered_office_address.premises',
        'data.registered_office_address.address_line_1',
        'data.registered_office_address.address_line_2',
        'data.registered_office_address.locality',
        'data.registered_office_address.region',
        'data.registered_office_address.postal_code',
        'data.registered_office_address.country',
        'data.voluntary-dissolution-indicator',
        'data.last_full_members_list_date',
        'data.sic_codes.0',
        'data.sic_codes.1',
        'data.sic_codes.2',
        'data.sic_codes.3',
      ]);
  }
};
