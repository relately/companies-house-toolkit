import flat from 'flat';
import { Knex } from 'knex';
import { Duplex } from 'stream';
import { getProduct217SnapshotDate } from '../../snapshot/product217.js';
import { formatIsoDate } from '../../util/dates.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../util/sources/types.js';
import { Product217Company } from './transformer/types.js';

export const product217ToDb = (
  db: Knex,
  source: FileSourceType | DirectorySourceType
) => {
  const snapshotDate = getProduct217SnapshotDate(source);

  return Duplex.from(async function* (
    records: AsyncGenerator<Product217Company>
  ) {
    for await (const record of records) {
      const data: Record<string, unknown> = flat.flatten(record, {
        delimiter: '_',
      });

      data.last_updated = formatIsoDate(snapshotDate);

      yield data;
    }
  });
};
