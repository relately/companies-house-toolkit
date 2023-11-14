import highland from 'highland';
import { createReadStream, statSync } from 'node:fs';
import { stat } from 'node:fs/promises';

export const getFileStream = (filePath: string) => {
  if (!statSync(filePath, { throwIfNoEntry: false })) {
    throw new Error(`File "${filePath}" does not exist`);
  }

  return highland<string>(createReadStream(filePath));
};

export const estimateFileSize = async (filePath: string) =>
  stat(filePath).then((stats) => stats.size);
