import { globSync } from 'glob';
import highland from 'highland';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

export type StdinSourceType = {
  type: 'stdin';
};

export type FileSourceType = {
  type: 'file';
  path: string;
};

export type DirectorySourceType = {
  type: 'directory';
  path: string;
  extension: string;
  fileSelection: 'all' | 'latest';
};

export type SourceType = StdinSourceType | FileSourceType | DirectorySourceType;

export const getSourceStream = (source: SourceType) => {
  switch (source.type) {
    case 'stdin':
      return getStdinStream();
    case 'file':
      return getFileStream(source.path);
    case 'directory':
      return getDirectoryFileStream(source);
  }
};

const estimateFileSize = async (filePath: string) =>
  stat(filePath).then((stats) => stats.size);

export const estimateSourceSize = async (source: SourceType) => {
  switch (source.type) {
    case 'stdin':
      return null;
    case 'file':
      return estimateFileSize(source.path);
    case 'directory':
      return Promise.all(getDirectoryFiles(source).map(estimateFileSize)).then(
        (sizes) => sizes.reduce((acc, size) => acc + size, 0)
      );
  }
};

const getStdinStream = () => highland<string>(process.stdin);

const getFileStream = (filePath: string) =>
  highland<string>(createReadStream(filePath));

const getDirectoryFiles = ({
  path,
  extension,
  fileSelection,
}: DirectorySourceType) => {
  const files = globSync(`${path}/**/*.${extension}`);

  if (files.length === 0) {
    throw new Error(
      `Directory "${path}" does not contain any ${extension} files`
    );
  }

  return fileSelection === 'latest'
    ? files.sort().slice(files.length - 1)
    : files.sort();
};

const getDirectoryFileStream = (directorySourceType: DirectorySourceType) => {
  const files = getDirectoryFiles(directorySourceType);

  return files.length === 1
    ? getFileStream(files[0])
    : highland(files).flatMap(getFileStream);
};
