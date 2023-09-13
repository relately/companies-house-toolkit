import { format, parse } from 'fast-csv';
import { globStream } from 'glob';
import { createReadStream } from 'node:fs';
import { Stream } from 'node:stream';

const processStream = (stream: Stream) => {
  stream
    .pipe(parse({ headers: true }))
    .pipe(format({ headers: true }))
    .pipe(process.stdout);
};

export const transformStdIn = () => processStream(process.stdin);
export const transformFile = (filePath: string) =>
  processStream(createReadStream(filePath));
export const transformDirectory = (directoryPath: string) =>
  globStream(`${directoryPath}/**/*.csv`).on('data', transformFile);
