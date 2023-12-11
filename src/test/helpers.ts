import EventEmitter from 'node:events';
import { Writable } from 'node:stream';

type CaptureCallback = (
  writeStream: Writable,
  eventEmitter: EventEmitter
) => void;

export const captureStreamOutput = (
  callback: CaptureCallback
): Promise<string> => {
  return new Promise((resolve) => {
    let output = '';

    const writeStream = new Writable({
      write(chunk: Buffer, _encoding, callback) {
        output += chunk.toString('utf-8');
        callback();
      },
    });

    const eventEmitter = new EventEmitter();
    eventEmitter.on('finish', () => {
      resolve(output);
    });

    callback(writeStream, eventEmitter);
  });
};

type CaptureWarningCallback = () => EventEmitter;

export const captureStreamWarnings = (
  callback: CaptureWarningCallback
): Promise<string[]> => {
  return new Promise((resolve) => {
    const warnings: string[] = [];

    callback()
      .on('warning', (warning: string) => {
        warnings.push(warning);
      })
      .on('finish', () => {
        resolve(warnings);
      });
  });
};
