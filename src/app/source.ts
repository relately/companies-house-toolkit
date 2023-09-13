import { globStream } from 'glob';
import highland from 'highland';
import { createReadStream } from 'node:fs';

export type SourceType = 'stdin' | 'file' | 'directory';

export const getSourceStream = (sourceType: SourceType, source: string) => {
  switch (sourceType) {
    case 'stdin':
      return getStdinStream();
    case 'file':
      return getFileStream(source);
    case 'directory':
      return getDirectoryFileStream(source);
  }
};

const getStdinStream = () => highland<string>(process.stdin);

const getFileStream = (filePath: string) =>
  highland<string>(createReadStream(filePath));

const getDirectoryFileStream = (directoryPath: string) =>
  highland(globStream(`${directoryPath}/**/*.csv`)).flatMap((filePath) =>
    highland<string>(createReadStream(filePath))
  );
