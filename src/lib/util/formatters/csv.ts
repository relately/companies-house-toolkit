import { format } from 'fast-csv';
import { flatten } from 'flat';
import { formatDates } from '../objects.js';
import { Through } from '../types.js';

export const formatCsv =
  <T extends object>(columns: string[] | boolean = true): Through<T, string> =>
  (stream) =>
    stream
      .map(formatDates)
      .map((record) => flatten(record))
      .through(format({ headers: columns }));
