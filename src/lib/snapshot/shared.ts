import { getAccountsNextMadeUpToDate } from '../products/shared/company.js';
import { parseIsoDate } from '../util/dates.js';
import { removeEmptyValues } from '../util/objects.js';
import { SnapshotCompany } from './types.js';

export const calculateValues = (
  companyRecord: SnapshotCompany
): SnapshotCompany =>
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
  }) as SnapshotCompany;
