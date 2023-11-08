import highland from 'highland';
import { EventEmitter } from 'node:events';
import { Duplex } from 'node:stream';
import { parseProduct101 } from '../product101/parser.js';
import { transformProduct101 } from '../product101/transformer.js';
import { CompanyTransaction } from '../product101/transformer/types.js';
import { DirectorySourceType, getSourceStream } from '../sources/index.js';
import { formatDates } from '../util/objects.js';
import { resolveBatch } from './db.js';
import {
  CompanySnapshotDB,
  CompanySnapshotOperation,
  SnapshotCompany,
} from './types.js';

export const writeUpdatesToDb = (
  db: CompanySnapshotDB,
  source: DirectorySourceType,
  eventEmitter: EventEmitter,
  batchSize = 1000
) =>
  getSourceStream(source, eventEmitter)
    .through(parseProduct101)
    .map(transformProduct101)
    .through(transformTransactionToBatchOperation())
    .batch(batchSize)
    .flatMap((batch: CompanySnapshotOperation[]) =>
      highland(resolveBatch(db, batch, eventEmitter))
    )
    .flatMap((batch) => highland(db.batch(batch)))
    .tap(() => eventEmitter.emit('progress', batchSize))
    .last()
    .toPromise(Promise);

const transformTransactionToBatchOperation = () =>
  Duplex.from(async function* (
    transactions: AsyncGenerator<CompanyTransaction>
  ) {
    for await (const transaction of transactions) {
      const operation = transactionToBatchOperation(transaction);

      if (operation) {
        yield operation;
      }
    }
  });

const transactionToBatchOperation = (
  transaction: CompanyTransaction
): CompanySnapshotOperation | undefined => {
  switch (transaction.type) {
    case 'incorporation':
    case 'add':
    case 'restoration':
      return {
        type: 'add',
        key: transaction.company_number,
        value: formatDates(transaction.data) as SnapshotCompany,
      };
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
      return {
        type: 'update',
        key: transaction.company_number,
        value: formatDates(transaction.data),
      };
    case 'delete':
      return {
        type: 'delete',
        key: transaction.company_number,
      };
    case 'no-longer-used':
    case 'country-of-origin-code':
    case 'dissolution-first-gazette':
    case 'gazettable-document-type-not-otherwise-included':
    case 'voluntary-dissolution-indicator':
      // Not covered by company format
      return;
  }
};
