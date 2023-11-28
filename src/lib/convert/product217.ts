import { parseProduct217 } from '../products/217/parser.js';
import { transformProduct217 } from '../products/217/transformer.js';
import { formatCsv } from '../util/formatters/csv.js';
import { formatJson } from '../util/formatters/json.js';
import { FormatterType } from '../util/formatters/types.js';
import { compose, map } from '../util/streams.js';

export const convertProduct217 = (formatterType: FormatterType) =>
  compose(
    parseProduct217(),
    map(transformProduct217),
    formatProduct217(formatterType)
  );

const formatProduct217 = (type: FormatterType) => {
  switch (type) {
    case 'json':
      return formatJson();
    case 'csv':
      return formatCsv([
        'company_number',
        'company_name',
        'type',
        'company_status',
        'date_of_creation',
        'date_of_cessation',
        'accounts.next_made_up_to',
        'accounts.next_due',
        'accounts.last_accounts.made_up_to',
        'accounts.last_accounts.type',
        'accounts.accounting_reference_date.day',
        'accounts.accounting_reference_date.month',
        'confirmation_statement.next_due',
        'confirmation_statement.last_made_up_to',
        'confirmation_statement.next_made_up_to',
        'has_charges',
        'registered_office_address.care_of',
        'registered_office_address.po_box',
        'registered_office_address.premises',
        'registered_office_address.address_line_1',
        'registered_office_address.address_line_2',
        'registered_office_address.locality',
        'registered_office_address.region',
        'registered_office_address.postal_code',
        'registered_office_address.country',
        'sic_codes.0',
        'sic_codes.1',
        'sic_codes.2',
        'sic_codes.3',
        'previous_company_names.0.ceased_on',
        'previous_company_names.0.effective_from',
        'previous_company_names.0.name',
        'previous_company_names.1.ceased_on',
        'previous_company_names.1.effective_from',
        'previous_company_names.1.name',
        'previous_company_names.2.ceased_on',
        'previous_company_names.2.effective_from',
        'previous_company_names.2.name',
        'previous_company_names.3.ceased_on',
        'previous_company_names.3.effective_from',
        'previous_company_names.3.name',
        'previous_company_names.4.ceased_on',
        'previous_company_names.4.effective_from',
        'previous_company_names.4.name',
        'previous_company_names.5.ceased_on',
        'previous_company_names.5.effective_from',
        'previous_company_names.5.name',
        'previous_company_names.6.ceased_on',
        'previous_company_names.6.effective_from',
        'previous_company_names.6.name',
        'previous_company_names.7.ceased_on',
        'previous_company_names.7.effective_from',
        'previous_company_names.7.name',
        'previous_company_names.8.ceased_on',
        'previous_company_names.8.effective_from',
        'previous_company_names.8.name',
        'previous_company_names.9.ceased_on',
        'previous_company_names.9.effective_from',
        'previous_company_names.9.name',
        'links.self',
      ]);
  }
};
