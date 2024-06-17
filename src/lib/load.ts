import knex, { Knex } from 'knex';
import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { parseProduct100 } from './products/100/parser.js';
import { transformProduct100 } from './products/100/transformer.js';
import { parseProduct101 } from './products/101/parser.js';
import { transformProduct101 } from './products/101/transformer.js';
import {
  getDbMapper,
  getParser,
  getSourceStream,
  getTransformer,
} from './products/index.js';
import { BatchBuffer } from './snapshot/db.js';
import { mergeDirectoryFiles } from './snapshot/updates.js';
import { Product } from './types/product.js';
import { parseIsoDate } from './util/dates.js';
import { getFileStream } from './util/sources/file.js';
import { DirectorySourceType, FileSourceType } from './util/sources/types.js';
import { batch, map, split, tap } from './util/streams.js';

type LoadOptions = {
  source: DirectorySourceType | FileSourceType;
  additionalSource?: DirectorySourceType;
  product: Product;
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
};

export const load = async (
  { product, source, additionalSource, connection }: LoadOptions,
  eventEmitter: EventEmitter
) => {
  const db: Knex = knex({ client: 'pg', connection });
  const batchSize = 1000;

  let bytesProcessed = 0;

  if (product === '101' && additionalSource) {
    await handleUpdates(
      db,
      1,
      eventEmitter,
      source as DirectorySourceType,
      additionalSource
    );

    return;
  }

  try {
    await pipeline(
      getSourceStream(product, source),
      tap(
        (item: Buffer) => (bytesProcessed += Buffer.byteLength(item, 'utf8'))
      ),
      getParser(product),
      getTransformer(product),
      await getDbMapper(product, db, source),
      batch(batchSize),
      writeBatch(db, product, () => {
        eventEmitter.emit('progress', bytesProcessed);
      })
    );
  } catch (error) {
    eventEmitter.emit('error', error);
  }

  eventEmitter.emit('finish');
};

const writeBatch = (db: Knex, product: Product, onBatch: () => void) =>
  new Writable({
    objectMode: true,
    async write(data: Record<string, unknown>[], _encoding, callback) {
      try {
        if (['101', '183', '217'].includes(product)) {
          await db('companies')
            .insert(data)
            .onConflict('company_number')
            .merge();
        } else {
          await db('officers').insert(data).onConflict('person_number').merge();
        }

        onBatch();
        callback();
      } catch (err) {
        callback(err as Error);
      }
    },
  });

const handleUpdates = async (
  db: Knex,
  batchSize: number,
  eventEmitter: EventEmitter,
  source: DirectorySourceType,
  alternativeSource: DirectorySourceType
) => {
  let bytesProcessed = 0;
  const buffer: BatchBuffer = new Map();

  const earliestDate = await db<string>('companies')
    .min('last_updated')
    .first();

  const files = mergeDirectoryFiles(
    source,
    parseIsoDate(earliestDate || '1970-01-01') || new Date('1970-01-01'),
    alternativeSource
  );

  for (const file of files) {
    const isProduct101 = file.startsWith(source.path);

    await pipeline(
      getFileStream(file),
      split(),
      tap((line: string) => {
        bytesProcessed += Buffer.byteLength(line, 'utf8');
      }),
      isProduct101 ? parseProduct101() : parseProduct100(),
      isProduct101 ? map(transformProduct101) : map(transformProduct100),
      await getDbMapper('101', db, source),
      batch(batchSize),
      writeBatch(db, '101', () => {
        eventEmitter.emit('progress', bytesProcessed);
      })
    );
  }

  // Flush the remaining buffer if it's not empty
  if (buffer.size > 0) {
    await db('companies')
      .insert(Array.from(buffer.values()))
      .onConflict('company_number')
      .merge();

    eventEmitter.emit('progress', bytesProcessed);
  }
};
