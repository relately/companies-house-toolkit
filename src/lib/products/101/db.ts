import flat from 'flat';
import { Knex } from 'knex';
import { Duplex } from 'stream';
import { parseIsoDate } from '../../util/dates.js';
import { CompanyTransaction } from './transformer/types.js';

export const product101ToDb = (db: Knex) => {
  return Duplex.from(async function* (
    transactions: AsyncGenerator<CompanyTransaction>
  ) {
    for await (const transaction of transactions) {
      const existing = await db<{ last_updated: string }>('companies')
        .select('last_updated')
        .where('company_number', transaction.company_number)
        .first();

      const lastUpdatedDate = existing
        ? parseIsoDate(existing.last_updated)
        : undefined;

      const receivedDate = transaction.received_date
        ? parseIsoDate(transaction.received_date)
        : undefined;

      if (lastUpdatedDate && receivedDate && receivedDate >= lastUpdatedDate) {
        const data = mapData(transaction);

        if (data) {
          yield data;
        }
      }
    }
  });
};

const mapData = (
  transaction: CompanyTransaction
): Record<string, unknown> | undefined => {
  switch (transaction.type) {
    case 'incorporation':
    case 'add':
    case 'restoration':
    case 'accounting-reference-date':
    case 'accounts':
    case 'accounts-made-up-date':
    case 'address':
    case 'confirmation-statement-date':
    case 'confirmation-statement-made-up-date':
    case 'conversion-between-plc-and-se':
    case 'converted-closed':
    case 'date-of-incorporation':
    case 'designation-as-private-fund-limited-partnership':
    case 'dissolution':
    case 'full-members-list':
    case 'gazettable-documents-submitted-by-subsidiary':
    case 'inspect-marker':
    case 'jurisdiction':
    case 'name':
    case 'sic-codes':
    case 'subsidiary-company-exemption-from-audit-or-filing-accounts':
    case 'type':
    case 'voluntary-arrangement':
      return Object.values(transaction.data).length > 0
        ? {
            ...flat.flatten(transaction.data, {
              delimiter: '_',
            }),
            company_number: transaction.company_number,
            last_updated: transaction.received_date || '',
          }
        : undefined;
    // Ignore delete for now
    case 'delete':
    case 'no-longer-used':
    case 'country-of-origin-code':
    case 'dissolution-first-gazette':
    case 'gazettable-document-type-not-otherwise-included':
    case 'voluntary-dissolution-indicator':
      // Not covered by company format
      return;
  }
};
