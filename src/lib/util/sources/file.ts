import { createReadStream, statSync } from 'node:fs';
import { stat } from 'node:fs/promises';

export const getFileStream = (filePath: string) => {
  if (!statSync(filePath, { throwIfNoEntry: false })) {
    throw new Error(`File "${filePath}" does not exist`);
  }

  return createReadStream(filePath, {
    // approximate line length of product 183 files (390 characters in UTF-8) * 10000 (batch size)
    highWaterMark: 390 * 10000,
  });
};

export const estimateFileSize = async (filePath: string) =>
  stat(filePath).then((stats) => stats.size);
