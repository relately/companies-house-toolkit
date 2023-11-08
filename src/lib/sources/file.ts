import highland from 'highland';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';

export const getFileStream = (filePath: string) =>
  highland<string>(createReadStream(filePath));

export const estimateFileSize = async (filePath: string) =>
  stat(filePath).then((stats) => stats.size);
