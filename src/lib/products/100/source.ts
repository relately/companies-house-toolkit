import {
  estimateDirectorySize,
  getDirectoryFileStream,
} from '../../util/sources/directory.js';
import { estimateFileSize, getFileStream } from '../../util/sources/file.js';
import { getStdinStream } from '../../util/sources/stdin.js';
import { SourceType } from '../../util/sources/types.js';

export const getProduct101SourceStream = (sourceType: SourceType) => {
  switch (sourceType.type) {
    case 'file':
      return getFileStream(sourceType.path);
    case 'directory':
      return getDirectoryFileStream(sourceType, '*_all_opt.txt', 'all');
    case 'stdin':
      return getStdinStream();
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
