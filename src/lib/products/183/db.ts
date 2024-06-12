import flat from 'flat';
import { Knex } from 'knex';
import { Duplex } from 'stream';
import { getProduct183SnapshotDate } from '../../snapshot/product183.js';
import { formatIsoDate } from '../../util/dates.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../util/sources/types.js';
import { Product183Company } from './transformer/types.js';

export const product183ToDb = async (
  db: Knex,
  source: FileSourceType | DirectorySourceType
) => {
  const snapshotDate = await getProduct183SnapshotDate(source);

  return Duplex.from(async function* (
    records: AsyncGenerator<Product183Company>
  ) {
    for await (const record of records) {
      const existing = await db<{ company_number: string }>('companies')
        .select('company_number')
        .where('company_number', record.company_number)
        .first();

      if (!existing) {
        const data: Record<string, unknown> = flat.flatten(record, {
          delimiter: '_',
        });

        data.last_updated = formatIsoDate(snapshotDate);

        yield data;
      }
    }
  });
};
