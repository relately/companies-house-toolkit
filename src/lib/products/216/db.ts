import flat from 'flat';
import { Knex } from 'knex';
import { Duplex } from 'stream';
import { formatIsoDate } from '../../util/dates.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../util/sources/types.js';
import { Product216Record } from './parser/types.js';
import { getProduct216SnapshotDate } from './source.js';

export const product216ToDb = async (
  db: Knex,
  source: FileSourceType | DirectorySourceType
) => {
  const snapshotDate = await getProduct216SnapshotDate(source);

  return Duplex.from(async function* (
    records: AsyncGenerator<Product216Record>
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
