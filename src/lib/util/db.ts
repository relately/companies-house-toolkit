import { BatchOperation, Level } from 'level';
import { Writable } from 'stream';

export const isLevelNotFoundError = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === 'LEVEL_NOT_FOUND';

export const writeBatch = <K, V>(db: Level<K, V>, onBatch: () => void) =>
  new Writable({
    objectMode: true,
    async write(
      batch: BatchOperation<Level<K, V>, K, V>[],
      _encoding,
      callback
    ) {
      try {
        await db.batch(batch);

        onBatch();
        callback();
      } catch (err) {
        callback(err as Error);
      }
    },
  });
