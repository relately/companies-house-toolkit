import { EventEmitter } from 'node:events';
import { Duplex, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { parseProduct100 } from '../products/100/parser.js';
import { Product100Transaction } from '../products/100/parser/types.js';
import { transformProduct100 } from '../products/100/transformer.js';
import { parseProduct101 } from '../products/101/parser.js';
import { Product101Transaction } from '../products/101/parser/types.js';
import { transformProduct101 } from '../products/101/transformer.js';
import { CompanyTransaction } from '../products/101/transformer/types.js';
import { parseIsoDate } from '../util/dates.js';
import { getDirectoryFiles } from '../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../util/sources/file.js';
import { DirectorySourceType } from '../util/sources/types.js';
import { filter, map, split, tap } from '../util/streams.js';
import { BatchBuffer, resolveBatch } from './db.js';
import { CompanySnapshotDB, CompanySnapshotOperation } from './types.js';

type Options = {
  db: CompanySnapshotDB;
  source: DirectorySourceType;
  alternativeSource?: DirectorySourceType;
  snapshotDate: Date;
  companies: Set<string>;
  eventEmitter: EventEmitter;
  batchSize?: number;
};

export const writeUpdatesToDb = async ({
  db,
  source,
  alternativeSource,
  snapshotDate,
  companies,
  eventEmitter,
  batchSize = 50000,
}: Options) => {
  const shouldProcess = (line: Product101Transaction | Product100Transaction) =>
    companies.size === 0 || companies.has(line.companyNumber);

  let bytesProcessed = 0;
  const buffer: BatchBuffer = new Map();

  const files = mergeDirectoryFiles(source, snapshotDate, alternativeSource);

  for (const file of files) {
    const isProduct101 = file.startsWith(source.path);

    await pipeline(
      getFileStream(file),
      split(),
      tap((line: string) => {
        bytesProcessed += Buffer.byteLength(line, 'utf8');
      }),
      isProduct101 ? parseProduct101() : parseProduct100(),
      filter((line: Product101Transaction | Product100Transaction) => {
        if (!shouldProcess(line)) {
          eventEmitter.emit('progress', bytesProcessed);
          bytesProcessed = 0;

          return false;
        }

        return true;
      }),
      isProduct101 ? map(transformProduct101) : map(transformProduct100),
      transformTransactionToBatchOperation(db),
      new Writable({
        objectMode: true,
        async write(operation: CompanySnapshotOperation, _encoding, callback) {
          try {
            const batch = await resolveBatch(
              db,
              operation,
              eventEmitter,
              buffer,
              batchSize
            );

            if (batch.length > 0) {
              await db.batch(batch);

              eventEmitter.emit('progress', bytesProcessed);
              bytesProcessed = 0;
            }

            callback();
          } catch (err) {
            callback(err as Error);
          }
        },
      })
    );
  }

  // Flush the remaining buffer if it's not empty
  if (buffer.size > 0) {
    await db.batch(Array.from(buffer.values()));

    eventEmitter.emit('progress', bytesProcessed);
  }
};

export const estimateUpdatesSize = (
  source: DirectorySourceType,
  snapshotDate: Date,
  alternativeSource?: DirectorySourceType
) =>
  Promise.all(
    mergeDirectoryFiles(source, snapshotDate, alternativeSource).map(
      estimateFileSize
    )
  ).then((sizes) => sizes.reduce((acc, size) => acc + size, 0));

export const mergeDirectoryFiles = (
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

const transformTransactionToBatchOperation = (db: CompanySnapshotDB) =>
  Duplex.from(async function* (
    transactions: AsyncGenerator<CompanyTransaction>
  ) {
    for await (const transaction of transactions) {
      const existing = await db
        .get(transaction.company_number)
        .catch(() => null);

      const lastUpdatedDate = existing
        ? parseIsoDate(existing.last_updated)
        : undefined;

      const receivedDate = transaction.received_date
        ? parseIsoDate(transaction.received_date)
        : undefined;

      if (lastUpdatedDate && receivedDate && receivedDate >= lastUpdatedDate) {
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
        value: {
          ...transaction.data,
          last_updated: transaction.received_date || '',
        },
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
      return Object.values(transaction.data).length > 0
        ? {
            type: 'update',
            key: transaction.company_number,
            value: {
              ...transaction.data,
              company_number: transaction.company_number,
              last_updated: transaction.received_date,
            },
          }
        : undefined;
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
