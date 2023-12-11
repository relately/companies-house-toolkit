import { Level } from 'level';
import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { formatCompanySnapshot } from './snapshot/formatter.js';
import { getSnapshotDate, writeSnapshotToDb } from './snapshot/snapshot.js';
import { CompanySnapshotDB, SnapshotCompany } from './snapshot/types.js';
import { writeUpdatesToDb } from './snapshot/updates.js';
import { FormatterType } from './util/formatters/types.js';
import { DirectorySourceType, FileSourceType } from './util/sources/types.js';

type SnapshotOptions = {
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
  alternativeUpdatesSource?: DirectorySourceType;
  companies?: string[];
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
    snapshotSource,
    updatesSource,
    alternativeUpdatesSource,
    formatterType,
    companies,
    writeStream = process.stdout,
  }: SnapshotOptions,
  db: CompanySnapshotDB,
  eventEmitter: EventEmitter
) => {
  try {
    await db.clear();

    eventEmitter.emit('status', 'writing snapshot');
    await writeSnapshotToDb({
      db,
      source: snapshotSource,
      companies,
      eventEmitter,
    });

    const snapshotDate = await getSnapshotDate(snapshotSource);

    eventEmitter.emit('status', 'writing updates');
    await writeUpdatesToDb({
      db,
      source: updatesSource,
      alternativeSource: alternativeUpdatesSource,
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
