import { globSync } from 'glob';
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

export const estimateSourceSize = (sourceType: SourceType, source: string) => {
  switch (sourceType) {
    case 'stdin':
      return Promise.resolve(null);
    case 'file':
      return getFileStream(source)
        .split()
        .reduce(-1, (count) => count + 1)
        .map((value) => (value > 0 ? value : 0))
        .toPromise(Promise);
    case 'directory':
      return getDirectoryFileStream(source)
        .split()
        .reduce(-1, (count) => count + 1)
        .map((value) => (value > 0 ? value : 0))
        .toPromise(Promise);
  }
};

const getStdinStream = () => highland<string>(process.stdin);

const getFileStream = (filePath: string) =>
  highland<string>(createReadStream(filePath));

const getDirectoryFileStream = (directoryPath: string) => {
  const files = globSync(`${directoryPath}/**/*.csv`);

  const filePath = files.sort().pop();

  if (!filePath) {
    throw new Error(
      `Directory "${directoryPath}" does not contain any CSV files`
    );
  }

  return getFileStream(filePath);
};
