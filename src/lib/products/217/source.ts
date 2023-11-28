import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { SourceType } from '../../util/sources/types.js';
import { compose } from '../../util/streams.js';

export const getProduct217SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return getFileStream(sourceType.path);
    case 'directory':
      return getDirectoryFileStream(sourceType, '*.csv', 'latest');
    case 'stdin':
      return compose(process.stdin);
  }
};

export const estimateProduct217SourceSize = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return estimateFileSize(sourceType.path);
    case 'directory':
      return estimateDirectorySize(sourceType, '*.csv', 'latest');
    case 'stdin':
      return null;
  }
};
