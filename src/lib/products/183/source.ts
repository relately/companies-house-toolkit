import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { getStdinStream } from '../../util/sources/stdin.js';
import { SourceType } from '../../util/sources/types.js';

export const getProduct183SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return getFileStream(sourceType.path);
    case 'directory':
      return getDirectoryFileStream(sourceType, '*.dat', 'all');
    case 'stdin':
      return getStdinStream();
  }
};

export const estimateProduct183SourceSize = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return estimateFileSize(sourceType.path);
    case 'directory':
      return estimateDirectorySize(sourceType, '*.dat', 'all');
    case 'stdin':
      return null;
  }
};
