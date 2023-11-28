import { parseProduct101 } from '../products/101/parser.js';
import { transformProduct101 } from '../products/101/transformer.js';
import { formatCsv } from '../util/formatters/csv.js';
import { formatJson } from '../util/formatters/json.js';
import { FormatterType } from '../util/formatters/types.js';
import { compose, map } from '../util/streams.js';

export const convertProduct101 = (formatterType: FormatterType) =>
  compose(
    parseProduct101(),
    map(transformProduct101),
    formatProduct101(formatterType)
  );

const formatProduct101 = (type: FormatterType) => {
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
