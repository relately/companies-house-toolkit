import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { SourceType } from '../../util/sources/types.js';
import { compose, split } from '../../util/streams.js';

export const getProduct183SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return compose(getFileStream(sourceType.path), split());
    case 'directory':
      return compose(
        getDirectoryFileStream(sourceType, '*.dat', 'all'),
        split()
      );
    case 'stdin':
      return compose(process.stdin, split());
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
