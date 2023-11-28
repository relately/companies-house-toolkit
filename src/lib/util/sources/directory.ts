import { globSync } from 'glob';
import { Readable, Transform } from 'stream';
import { compose } from '../streams.js';
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
  compose(
    Readable.from(getDirectoryFiles(source, extension, fileSelection)),
    readFilesInSequence()
  );

export const readFilesInSequence = () => {
  let currentFileStream: null | Readable = null;

  return new Transform({
    objectMode: true,
    transform(filename: string, _encoding, callback) {
      if (currentFileStream) {
        currentFileStream.destroy();
      }

      currentFileStream = getFileStream(filename);

      currentFileStream.on('data', (chunk) => {
        this.push(chunk);
      });

      currentFileStream.on('end', callback);
      currentFileStream.on('error', callback);
    },

    final(callback) {
      if (currentFileStream) {
        currentFileStream.destroy();
      }
      callback();
    },
  });
};

export const estimateDirectorySize = (
  source: DirectorySourceType,
  extension: string,
  fileSelection: DirectoryFileSelection
) =>
  Promise.all(
    getDirectoryFiles(source, extension, fileSelection).map(estimateFileSize)
  ).then((sizes) => sizes.reduce((acc, size) => acc + size, 0));
