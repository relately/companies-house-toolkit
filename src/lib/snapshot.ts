import { Level } from 'level';
import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { formatCompanySnapshot } from './snapshot/formatter.js';
import {
  getProduct183SnapshotDate,
  writeProduct183ToDb,
} from './snapshot/product183.js';
import {
  getProduct217SnapshotDate,
  writeProduct217ToDb,
} from './snapshot/product217.js';
import { CompanySnapshotDB, SnapshotCompany } from './snapshot/types.js';
import { writeUpdatesToDb } from './snapshot/updates.js';
import { formatIsoDate } from './util/dates.js';
import { FormatterType } from './util/formatters/types.js';
import { DirectorySourceType, FileSourceType } from './util/sources/types.js';

type SnapshotOptions = {
  product183Source: FileSourceType | DirectorySourceType;
  product101Source: DirectorySourceType;
  product100Source: DirectorySourceType;
  product217Source: FileSourceType | DirectorySourceType;
  companies: Set<string>;
  formatterType: FormatterType;
  writeStream?: Writable;
};

export const snapshot = (
  options: SnapshotOptions,
  eventEmitter: EventEmitter
) => {
  const db = new Level<string, SnapshotCompany>('db', {
    valueEncoding: 'json',
  });

  void processSnapshot(options, db, eventEmitter);
};

const processSnapshot = async (
  {
    product183Source,
    product101Source,
    product100Source,
    product217Source,
    formatterType,
    companies,
    writeStream = process.stdout,
  }: SnapshotOptions,
  db: CompanySnapshotDB,
  eventEmitter: EventEmitter
) => {
  try {
    eventEmitter.emit('status', 'clearing database');
    await db.clear();

    const product217SnapshotDate = getProduct217SnapshotDate(product217Source);

    // Write product 217 snapshot data
    eventEmitter.emit('status', 'writing product 217');
    await writeProduct217ToDb({
      db,
      source: product217Source,
      snapshotDate: formatIsoDate(product217SnapshotDate),
      companies,
      eventEmitter,
    });

    const snapshotDate = await getProduct183SnapshotDate(product183Source);

    // Write product 183 snapshot data for companies not in product 217
    eventEmitter.emit('status', 'writing product 183');
    await writeProduct183ToDb({
      db,
      source: product183Source,
      snapshotDate: formatIsoDate(snapshotDate),
      companies,
      eventEmitter,
    });

    // Apply updates up to records after the row's snapshot date
    eventEmitter.emit('status', 'writing updates');
    await writeUpdatesToDb({
      db,
      source: product101Source,
      alternativeSource: product100Source,
      snapshotDate,
      companies,
      eventEmitter,
    });

    eventEmitter.emit('status', 'reading from db');
    await pipeline(
      db.values(),
      formatCompanySnapshot(formatterType),
      writeStream
    );

    await db.close();
    eventEmitter.emit('finish');
  } catch (error) {
    console.error(error);

    if (error instanceof Error && 'message' in error) {
      eventEmitter.emit('error', error.message);
    }
  }
};
