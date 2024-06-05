import EventEmitter from 'events';
import { BatchOperation } from 'level';
import { pipeline } from 'stream/promises';
import { parseProduct217 } from '../products/217/parser.js';
import { Product217Record } from '../products/217/parser/types.js';
import { getProduct217SourceStream } from '../products/217/source.js';
import { transformProduct217 } from '../products/217/transformer.js';
import { Product217Company } from '../products/217/transformer/types.js';
import { writeBatch } from '../util/db.js';
import { getDirectoryFiles } from '../util/sources/directory.js';
import { DirectorySourceType, FileSourceType } from '../util/sources/types.js';
import { batch, filter, map, tap } from '../util/streams.js';
import { calculateValues } from './shared.js';
import { CompanySnapshotDB, SnapshotCompany } from './types.js';

export const getProduct217SnapshotDate = (
  source: FileSourceType | DirectorySourceType
) => {
  const path =
    source.type === 'directory'
      ? getDirectoryFiles(source, '*.csv', 'latest')[0]
      : source.path;

  // Split the path into segments
  const segments = path.split('/');

  // Extract the year, month, and day from the segments
  // Assuming the structure is always %year%/%month%/%day%/prod217.csv
  const year = parseInt(segments[segments.length - 4]);
  const month = parseInt(segments[segments.length - 3]) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(segments[segments.length - 2]);

  // Create a new Date object with the extracted year, month, and day
  return new Date(year, month, day);
};

type WriteSnapshotOptions = {
  db: CompanySnapshotDB;
  source: FileSourceType | DirectorySourceType;
  snapshotDate: string;
  companies: Set<string>;
  eventEmitter: EventEmitter;
  batchSize?: number;
};

export const writeProduct217ToDb = async ({
  db,
  source,
  snapshotDate,
  eventEmitter,
  companies,
  batchSize = 5000,
}: WriteSnapshotOptions) => {
  const shouldProcess = (line: Product217Record) =>
    companies.size === 0 || companies.has(line.CompanyNumber);

  let bytesProcessed = 0;

  await pipeline(
    getProduct217SourceStream(source),
    tap((line: Buffer) => {
      bytesProcessed += Buffer.byteLength(line, 'utf8');
    }),
    parseProduct217(),
    filter((parsedLine: Product217Record) => {
      if (!shouldProcess(parsedLine)) {
        eventEmitter.emit('progress', bytesProcessed);
        bytesProcessed = 0;

        return false;
      }

      return true;
    }),
    map(transformProduct217),
    map((companyRecord: Product217Company) =>
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
  companyRecord: Product217Company,
  snapshotDate: string
): BatchOperation<CompanySnapshotDB, string, SnapshotCompany> => ({
  type: 'put',
  key: companyRecord.company_number,
  value: {
    ...calculateValues(companyRecord),
    last_updated: snapshotDate,
  } as SnapshotCompany,
});
