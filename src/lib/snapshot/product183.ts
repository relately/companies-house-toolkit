import { parseISO } from 'date-fns';
import { EventEmitter } from 'events';
import highland from 'highland';
import { BatchOperation } from 'level';

import { parseProduct183 } from '../products/183/parser.js';
import { parseHeader } from '../products/183/parser/parseLine.js';
import { getProduct183SourceStream } from '../products/183/source.js';
import { transformProduct183 } from '../products/183/transformer.js';
import { Product183Company } from '../products/183/transformer/types.js';
import { formatDates } from '../util/objects.js';
import { DirectorySourceType, FileSourceType } from '../util/sources/types.js';
import { CompanySnapshotDB, SnapshotCompany } from './types.js';

export const getSnapshotDate = (source: FileSourceType | DirectorySourceType) =>
  getProduct183SourceStream(source)
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
  getProduct183SourceStream(source)
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
