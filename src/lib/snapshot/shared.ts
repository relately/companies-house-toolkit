import { Product183Company } from '../products/183/transformer/types.js';
import { Company } from '../types/company.js';
import { removeEmptyValues } from '../util/objects.js';
import { RecursivePartial } from '../util/types.js';
import { SnapshotCompany } from './types.js';

export const calculateValues = (
  companyRecord: Product183Company | RecursivePartial<Company>
): SnapshotCompany =>
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
  }) as SnapshotCompany;
