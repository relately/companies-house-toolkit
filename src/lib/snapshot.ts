import { Level } from 'level';
import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { FormatterType } from './convert.js';
import { readValuesFromDb } from './snapshot/db.js';
import { writeUpdatesToDb } from './snapshot/product101.js';
import { getSnapshotDate, writeSnapshotToDb } from './snapshot/product183.js';
import { CompanySnapshotDB, SnapshotCompany } from './snapshot/types.js';
import { DirectorySourceType, FileSourceType } from './sources/index.js';

type SnapshotOptions = {
  snapshotSource: FileSourceType | DirectorySourceType;
  updatesSource: DirectorySourceType;
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

    eventEmitter.emit('status', 'writing updates');
    await writeUpdatesToDb(
      db,
      {
        ...updatesSource,
        fileSelection: await getSnapshotDate(snapshotSource),
      },
      eventEmitter
    );

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
