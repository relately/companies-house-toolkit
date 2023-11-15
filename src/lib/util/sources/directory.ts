import { globSync } from 'glob';
import highland from 'highland';
import { allFiles, filesAfter, latestFile } from './directory/fileSelection.js';
import { estimateFileSize, getFileStream } from './file.js';
import { DirectoryFileSelection, DirectorySourceType } from './types.js';

export const getDirectoryFiles = (
  { path }: DirectorySourceType,
  fileGlob: string,
  fileSelection: DirectoryFileSelection
) => {
  const files = globSync(`${path}/**/${fileGlob}`);

  if (files.length === 0) {
    throw new Error(
      `Directory "${path}" does not contain any files matching "${fileGlob}".`
    );
  }

  if (fileSelection instanceof Date) {
    return filesAfter(fileSelection, files);
  } else if (fileSelection === 'latest') {
    return latestFile(files);
  }

  return allFiles(files);
};

export const getDirectoryFileStream = (
  source: DirectorySourceType,
  extension: string,
  fileSelection: DirectoryFileSelection
) =>
  highland(getDirectoryFiles(source, extension, fileSelection)).flatMap(
    getFileStream
  );

export const estimateDirectorySize = (
  source: DirectorySourceType,
  extension: string,
  fileSelection: DirectoryFileSelection
) =>
  Promise.all(
    getDirectoryFiles(source, extension, fileSelection).map(estimateFileSize)
  ).then((sizes) => sizes.reduce((acc, size) => acc + size, 0));
