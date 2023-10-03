import { EventEmitter, Writable } from 'node:stream';

type CaptureCallback = (writeStream: Writable) => EventEmitter;

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

    callback(writeStream).on('finish', () => {
      resolve(output);
    });
  });
};
