import { EventEmitter } from 'node:events';
import { estimateDirectorySize, getDirectoryFileStream } from './directory.js';
import { estimateFileSize, getFileStream } from './file.js';
import { getStdinStream } from './stdin.js';

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
  fileSelection: 'all' | 'latest' | Date;
};

export type SourceType = StdinSourceType | FileSourceType | DirectorySourceType;

export const getSourceStream = (
  source: SourceType,
  eventEmitter?: EventEmitter
) => {
  switch (source.type) {
    case 'stdin':
      return getStdinStream();
    case 'file':
      return getFileStream(source.path);
    case 'directory':
      return getDirectoryFileStream(source, eventEmitter);
  }
};

export const estimateSourceSize = async (source: SourceType) => {
  switch (source.type) {
    case 'stdin':
      return null;
    case 'file':
      return estimateFileSize(source.path);
    case 'directory':
      return estimateDirectorySize(source);
  }
};
