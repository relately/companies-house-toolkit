import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { SourceType } from '../../util/sources/types.js';
import { compose, split } from '../../util/streams.js';

export const getProduct216SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return compose(getFileStream(sourceType.path), split());
    case 'directory':
      return compose(
        getDirectoryFileStream(sourceType, 'Prod216_*.dat', 'all'),
        split()
      );
    case 'stdin':
      return compose(process.stdin, split());
  }
};

export const estimateProduct216SourceSize = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return estimateFileSize(sourceType.path);
    case 'directory':
      return estimateDirectorySize(sourceType, 'Prod216_*.dat', 'all');
    case 'stdin':
      return null;
  }
};
