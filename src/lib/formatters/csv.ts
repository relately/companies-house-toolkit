import { format } from 'fast-csv';
import { flatten } from 'flat';
import { Through } from '../convert.js';
import { formatDates } from '../util/objects.js';

export const formatCsv =
  <T extends object>(columns: string[] | boolean = true): Through<T, string> =>
  (stream) =>
    stream
      .map(formatDates)
      .map((record) => flatten(record))
      .through(format({ headers: columns }));
