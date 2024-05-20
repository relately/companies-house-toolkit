import { transformProduct183 } from '../products/183/transformer.js';
import { Product183Company } from '../products/183/transformer/types.js';
import { getAccountsNextMadeUpToDate } from '../products/shared/company.js';
import { parseIsoDate } from '../util/dates.js';
import { formatCsv } from '../util/formatters/csv.js';
import { formatJson } from '../util/formatters/json.js';
import { FormatterType } from '../util/formatters/types.js';
import { removeEmptyValues } from '../util/objects.js';
import { compose, map } from '../util/streams.js';

export const convertProduct183 = (formatterType: FormatterType) =>
  compose(
    map(transformProduct183),
    map(calculateValues),
    formatProduct183(formatterType)
  );

export const calculateValues = (
  companyRecord: Product183Company
): Product183Company =>
  removeEmptyValues({
    ...companyRecord,
    accounts: {
      ...companyRecord.accounts,
      next_made_up_to: getAccountsNextMadeUpToDate(
        companyRecord.accounts?.accounting_reference_date?.month,
        companyRecord.accounts?.accounting_reference_date?.day,
        companyRecord.accounts?.last_accounts?.made_up_to
          ? parseIsoDate(companyRecord.accounts.last_accounts.made_up_to)
          : undefined,
        companyRecord.accounts?.next_due
          ? parseIsoDate(companyRecord.accounts.next_due)
          : undefined,
        companyRecord.date_of_creation
          ? parseIsoDate(companyRecord.date_of_creation)
          : undefined
      ),
    },
  }) as Product183Company;

const formatProduct183 = (type: FormatterType) => {
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
        'links.self',
      ]);
  }
};
