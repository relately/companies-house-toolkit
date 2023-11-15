import { Level } from 'level';
import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { readValuesFromDb } from './snapshot/db.js';
import { writeUpdatesToDb } from './snapshot/product101.js';
import { getSnapshotDate, writeSnapshotToDb } from './snapshot/product183.js';
import { CompanySnapshotDB, SnapshotCompany } from './snapshot/types.js';
import { FormatterType } from './util/formatters/types.js';
import { DirectorySourceType, FileSourceType } from './util/sources/types.js';

type SnapshotOptions = {
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
  alternativeUpdatesSource?: DirectorySourceType;
  formatterType: FormatterType;
  writeStream?: Writable;
};

export const snapshot = (options: SnapshotOptions) => {
  const eventEmitter = new EventEmitter();
  const db = new Level<string, SnapshotCompany>('db', {
    valueEncoding: 'json',
  });

  void processSnapshot(options, db, eventEmitter);

  return eventEmitter;
};

const processSnapshot = async (
  {
    snapshotSource,
    updatesSource,
    alternativeUpdatesSource,
    formatterType,
    writeStream = process.stdout,
  }: SnapshotOptions,
  db: CompanySnapshotDB,
  eventEmitter: EventEmitter
) => {
  try {
    await db.clear();

    eventEmitter.emit('status', 'writing snapshot');
    await writeSnapshotToDb(db, snapshotSource, eventEmitter);

    const snapshotDate = await getSnapshotDate(snapshotSource);

    eventEmitter.emit('status', 'writing updates');
    await writeUpdatesToDb({
      db,
      source: updatesSource,
      alternativeSource: alternativeUpdatesSource,
      snapshotDate,
      eventEmitter,
    });

    eventEmitter.emit('status', 'reading from db');
    readValuesFromDb(db, formatterType)
      .pipe(writeStream)
      .on('finish', () => {
        void db.close().then(() => eventEmitter.emit('finish'));
      });
  } catch (error) {
    if (error instanceof Error && 'message' in error) {
      eventEmitter.emit('error', error.message);
    }
  }
};
