import { parse } from 'fast-csv';

export const parseCsv = (
  stream: Highland.Stream<string>
): Highland.Stream<Record<string, unknown>> =>
  stream.through(parse({ headers: true }));
