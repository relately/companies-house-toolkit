import { EventEmitter, once } from 'events';
import { BatchOperation } from 'level';

import { Duplex } from 'stream';
import { pipeline } from 'stream/promises';
import { parseProduct183 } from '../products/183/parser.js';
import { parseHeader } from '../products/183/parser/parseLine.js';
import { Product183Record } from '../products/183/parser/types.js';
import { getProduct183SourceStream } from '../products/183/source.js';
import { transformProduct183 } from '../products/183/transformer.js';
import { Product183Company } from '../products/183/transformer/types.js';
import { writeBatch } from '../util/db.js';
import { DirectorySourceType, FileSourceType } from '../util/sources/types.js';
import { batch, filter, map, tap } from '../util/streams.js';
import { CompanySnapshotDB, SnapshotCompany } from './types.js';

export const getProduct183SnapshotDate = async (
  source: FileSourceType | DirectorySourceType
) => {
  const lines = getProduct183SourceStream(source);
  const firstLine = await once(lines, 'data');
  const header = parseHeader(firstLine.toString());

  return new Date(header.fileProductionDate);
};

type WriteSnapshotOptions = {
  db: CompanySnapshotDB;
  source: FileSourceType | DirectorySourceType;
  snapshotDate: string;
  companies: Set<string>;
  eventEmitter: EventEmitter;
  batchSize?: number;
};

export const writeProduct183ToDb = async ({
  db,
  source,
  snapshotDate,
  eventEmitter,
  companies,
  batchSize = 10000,
}: WriteSnapshotOptions) => {
  const shouldProcess = (line: Product183Record) =>
    companies.size === 0 || companies.has(line.companyNumber);

  let bytesProcessed = 0;

  await pipeline(
    getProduct183SourceStream(source),
    tap((line: Buffer) => {
      bytesProcessed += Buffer.byteLength(line, 'utf8');
    }),
    parseProduct183(),
    filter((parsedLine: Product183Record) => {
      if (!shouldProcess(parsedLine)) {
        eventEmitter.emit('progress', bytesProcessed);
        bytesProcessed = 0;

        return false;
      }

      return true;
    }),
    map(transformProduct183),
    filterExistingRecords(db),
    map((companyRecord: Product183Company) =>
      companyRecordToBatchOperation(companyRecord, snapshotDate)
    ),
    batch(batchSize),
    writeBatch(db, () => {
      eventEmitter.emit('progress', bytesProcessed);
      bytesProcessed = 0;
    })
  );
};

const companyRecordToBatchOperation = (
  companyRecord: Product183Company,
  snapshotDate: string
): BatchOperation<CompanySnapshotDB, string, SnapshotCompany> => ({
  type: 'put',
  key: companyRecord.company_number,
  value: {
    ...companyRecord,
    last_updated: snapshotDate,
  },
});

const filterExistingRecords = (db: CompanySnapshotDB) =>
  Duplex.from(async function* (companies: AsyncGenerator<Product183Company>) {
    for await (const company of companies) {
      const existing = await db.get(company.company_number).catch(() => null);

      if (!existing) {
        yield company;
      }
    }
  });
