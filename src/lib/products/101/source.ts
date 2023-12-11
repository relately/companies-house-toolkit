import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { SourceType } from '../../util/sources/types.js';
import { compose, split } from '../../util/streams.js';

export const getProduct101SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return compose(getFileStream(sourceType.path), split());
    case 'directory':
      return compose(
        getDirectoryFileStream(sourceType, '*_all_opt.txt', 'all'),
        split()
      );
    case 'stdin':
      return compose(process.stdin, split());
  }
};

export const estimateProduct101SourceSize = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return estimateFileSize(sourceType.path);
    case 'directory':
      return estimateDirectorySize(sourceType, '*_all_opt.txt', 'all');
    case 'stdin':
      return null;
  }
};
