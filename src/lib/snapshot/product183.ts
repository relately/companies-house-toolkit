import { parseISO } from 'date-fns';
import highland from 'highland';
import { BatchOperation } from 'level';
import { EventEmitter } from 'stream';
import { parseProduct183 } from '../product183/parser.js';
import { parseHeader } from '../product183/parser/parseLine.js';
import { transformProduct183 } from '../product183/transformer.js';
import { Product183Company } from '../product183/transformer/types.js';
import {
  DirectorySourceType,
  FileSourceType,
  getSourceStream,
} from '../sources/index.js';
import { formatDates } from '../util/objects.js';
import { CompanySnapshotDB, SnapshotCompany } from './types.js';

export const getSnapshotDate = (source: FileSourceType | DirectorySourceType) =>
  getSourceStream(source)
    .split()
    .take(1)
    .map(parseHeader)
    .map((header) => parseISO(header.fileProductionDate))
    .toPromise(Promise);

export const writeSnapshotToDb = (
  db: CompanySnapshotDB,
  source: FileSourceType | DirectorySourceType,
  eventEmitter: EventEmitter,
  batchSize = 10000
) =>
  getSourceStream(source, eventEmitter)
    .through(parseProduct183)
    .through(transformProduct183)
    .map(companyRecordToBatchOperation)
    .batch(batchSize)
    .flatMap(highland.wrapCallback(db.batch.bind(db)))
    .tap(() => eventEmitter.emit('progress', batchSize))
    .last()
    .toPromise(Promise);

const companyRecordToBatchOperation = (
  companyRecord: Product183Company
): BatchOperation<CompanySnapshotDB, string, SnapshotCompany> => ({
  type: 'put',
  key: companyRecord.company_number,
  value: formatDates(companyRecord) as SnapshotCompany,
});
