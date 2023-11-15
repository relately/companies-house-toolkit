import highland from 'highland';
import { EventEmitter } from 'node:events';
import { Duplex } from 'node:stream';
import { parseProduct100 } from '../products/100/parser.js';
import { transformProduct100 } from '../products/100/transformer.js';
import { parseProduct101 } from '../products/101/parser.js';
import { transformProduct101 } from '../products/101/transformer.js';
import { CompanyTransaction } from '../products/101/transformer/types.js';
import { formatDates } from '../util/objects.js';
import { getDirectoryFiles } from '../util/sources/directory.js';
import { getFileStream } from '../util/sources/file.js';
import { DirectorySourceType } from '../util/sources/types.js';
import { resolveBatch } from './db.js';
import {
  CompanySnapshotDB,
  CompanySnapshotOperation,
  SnapshotCompany,
} from './types.js';

type Options = {
  db: CompanySnapshotDB;
  source: DirectorySourceType;
  alternativeSource?: DirectorySourceType;
  snapshotDate: Date;
  eventEmitter: EventEmitter;
  batchSize?: number;
};

export const writeUpdatesToDb = ({
  db,
  source,
  alternativeSource,
  snapshotDate,
  eventEmitter,
  batchSize = 1000,
}: Options) =>
  highland(mergeDirectoryFiles(source, snapshotDate, alternativeSource))
    .flatMap((file) => {
      const stream = getFileStream(file);

      if (file.startsWith(source.path)) {
        return stream.through(parseProduct101).map(transformProduct101);
      } else if (alternativeSource && file.startsWith(alternativeSource.path)) {
        return stream.through(parseProduct100).map(transformProduct100);
      }
    })
    .through(transformTransactionToBatchOperation(snapshotDate))
    .batch(batchSize)
    .flatMap((batch: CompanySnapshotOperation[]) =>
      highland(resolveBatch(db, batch, eventEmitter))
    )
    .flatMap((batch) => highland(db.batch(batch)))
    .tap(() => eventEmitter.emit('progress', batchSize))
    .last()
    .toPromise(Promise);

const mergeDirectoryFiles = (
  source: DirectorySourceType,
  snapshotDate: Date,
  alternativeSource?: DirectorySourceType
) => {
  const files = getDirectoryFiles(source, '*_all_opt.txt', snapshotDate);
  const alternativeFiles = alternativeSource
    ? getDirectoryFiles(alternativeSource, '*_all_opt.txt', snapshotDate)
    : [];

  const filePattern = /\d{4}_all_opt\.txt$/;

  const fileNames = new Set(files.map((file) => file.match(filePattern)?.[0]));

  const missingFiles = alternativeFiles.filter((file) => {
    const fileName = file.match(filePattern)?.[0];
    return fileName && !fileNames.has(fileName);
  });

  return [...files, ...missingFiles].sort((a, b) => {
    const aMatch = a.match(filePattern)?.[0];
    const bMatch = b.match(filePattern)?.[0];
    if (aMatch && bMatch) {
      return aMatch.localeCompare(bMatch);
    }
    return 0;
  });
};

const transformTransactionToBatchOperation = (snapshotDate: Date) =>
  Duplex.from(async function* (
    transactions: AsyncGenerator<CompanyTransaction>
  ) {
    for await (const transaction of transactions) {
      if (
        transaction.received_date &&
        transaction.received_date >= snapshotDate
      ) {
        const operation = transactionToBatchOperation(transaction);

        if (operation) {
          yield operation;
        }
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
