import { Company } from '../../types/company.js';
import { formatIsoDate } from '../../util/dates.js';
import { removeEmptyValues } from '../../util/objects.js';
import { RecursivePartial } from '../../util/types.js';

export const calculateValues = (
  companyRecord: RecursivePartial<Company>
): RecursivePartial<Company> =>
  removeEmptyValues({
    ...companyRecord,
    accounts: {
      ...companyRecord.accounts,
      // Always unset these as they cannot be reliably derived
      next_due: undefined,
      next_made_up_to: undefined,
    },
    confirmation_statement: {
      ...companyRecord.confirmation_statement,
      // Always unset these as they cannot be reliably derived
      next_due: undefined,
      next_made_up_to: undefined,
    },
  });

export const getAccountsNextMadeUpToDate = (
  accountsReferenceMonth?: number,
  accountsReferenceDay?: number,
  lastMadeUpToDate?: Date,
  nextDue?: Date,
  dateOfIncorporation?: Date
): string | undefined => {
  if (
    accountsReferenceDay == undefined ||
    accountsReferenceDay > 31 ||
    accountsReferenceMonth === undefined ||
    accountsReferenceMonth > 12
  ) {
    return undefined;
  }

  // If last made up to date is set then return the next reference date after it
  if (lastMadeUpToDate) {
    return getNextReferenceDateAfter(
      lastMadeUpToDate,
      accountsReferenceMonth,
      accountsReferenceDay
    );
  }

  // If next due date is set then return the last reference date before it
  if (nextDue) {
    return getLastReferenceDateBefore(
      nextDue,
      accountsReferenceMonth,
      accountsReferenceDay
    );
  }

  // If date of incorporation is set then return the next reference date after a year
  if (dateOfIncorporation) {
    return getNextReferenceDateAfter(
      dateOfIncorporation,
      accountsReferenceMonth,
      accountsReferenceDay
    );
  }

  // Otherwise we can't calculate the next made up to date
  return undefined;
};

const getNextReferenceDateAfter = (
  date: Date,
  referenceMonth: number,
  referenceDay: number
) => {
  const nextDate = new Date(
    Date.UTC(date.getUTCFullYear() + 1, referenceMonth - 1, referenceDay)
  );

  return formatIsoDate(nextDate);
};

const getLastReferenceDateBefore = (
  date: Date,
  referenceMonth: number,
  referenceDay: number
) => {
  const lastDate = new Date(
    Date.UTC(date.getUTCFullYear(), referenceMonth - 1, referenceDay)
  );

  if (lastDate > date) {
    lastDate.setUTCFullYear(lastDate.getUTCFullYear() - 1);
  }

  return formatIsoDate(lastDate);
};
