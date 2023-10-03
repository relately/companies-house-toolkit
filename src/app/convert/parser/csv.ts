import { parse } from 'fast-csv';
import { Through } from '../../convert.js';

export const parseCsv: Through<string, Record<string, string>> = (stream) =>
  stream.through(parse({ headers: true })) as Highland.Stream<
    Record<string, string>
  >;
