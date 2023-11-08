import { globSync } from 'glob';
import highland from 'highland';
import { allFiles, filesAfter, latestFile } from './directory/fileSelection.js';
import { estimateFileSize, getFileStream } from './file.js';
import { DirectorySourceType } from './index.js';

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

  if (fileSelection instanceof Date) {
    return filesAfter(fileSelection, files);
  } else if (fileSelection === 'latest') {
    return latestFile(files);
  }

  return allFiles(files);
};

export const getDirectoryFileStream = (source: DirectorySourceType) =>
  highland(getDirectoryFiles(source)).flatMap(getFileStream);

export const estimateDirectorySize = (source: DirectorySourceType) =>
  Promise.all(getDirectoryFiles(source).map(estimateFileSize)).then((sizes) =>
    sizes.reduce((acc, size) => acc + size, 0)
  );
