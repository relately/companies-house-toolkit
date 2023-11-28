import { EventEmitter, once } from 'events';
import { BatchOperation } from 'level';

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
import { calculateValues } from './shared.js';
import { CompanySnapshotDB, SnapshotCompany } from './types.js';

export const getSnapshotDate = async (
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
  companies?: string[];
  eventEmitter: EventEmitter;
  batchSize?: number;
};

export const writeSnapshotToDb = async ({
  db,
  source,
  eventEmitter,
  companies,
  batchSize = 10000,
}: WriteSnapshotOptions) => {
  const shouldProcess = (line: Product183Record) =>
    !companies || companies.includes(line.companyNumber);

  let bytesProcessed = 0;

  await pipeline(
    getProduct183SourceStream(source),
    tap((line: Buffer) => {
      bytesProcessed += Buffer.byteLength(line, 'utf8');
    }),
    parseProduct183(),
    tap((parsedLine: Product183Record) => {
      if (!shouldProcess(parsedLine)) {
        eventEmitter.emit('progress', bytesProcessed);
        bytesProcessed = 0;
      }
    }),
    filter(shouldProcess),
    map(transformProduct183),
    map(companyRecordToBatchOperation),
    batch(batchSize),
    writeBatch(db, () => {
      eventEmitter.emit('progress', bytesProcessed);
      bytesProcessed = 0;
    })
  );
};

const companyRecordToBatchOperation = (
  companyRecord: Product183Company
): BatchOperation<CompanySnapshotDB, string, SnapshotCompany> => ({
  type: 'put',
  key: companyRecord.company_number,
  value: calculateValues(companyRecord),
});
