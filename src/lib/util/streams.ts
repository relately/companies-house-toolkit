import multipipe from 'multipipe';
import { Transform } from 'node:stream';
import split2 from 'split2';

export const map = <T, U>(f: (chunk: T) => U) =>
  new Transform({
    objectMode: true,
    transform(chunk: T, _encoding, callback) {
      this.push(f(chunk));
      callback();
    },
  });

export const filter = <T>(f: (chunk: T) => boolean) =>
  new Transform({
    objectMode: true,
    transform(chunk: T, _encoding, callback) {
      if (f(chunk)) {
        this.push(chunk);
      }
      callback();
    },
  });

export const tap = <T>(sideEffect: (chunk: T) => void) =>
  new Transform({
    objectMode: true,
    transform(chunk: T, _encoding, callback) {
      sideEffect(chunk);

      this.push(chunk);

      callback();
    },
  });

export const batch = <T>(batchSize: number) => {
  let batch: T[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk: T, _encoding, callback) {
      batch.push(chunk);

      if (batch.length === batchSize) {
        this.push(batch);
        batch = [];
      }

      callback();
    },

    flush(callback) {
      if (batch.length > 0) {
        this.push(batch);
      }

      callback();
    },
  });
};

export const compose = multipipe;
export const split = () => split2(/(?<!\r)\n/);
