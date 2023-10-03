import { convertDates, trimKeys } from './shared.js';

export const transformCsv = <T extends Record<string, unknown>>(
  stream: Highland.Stream<T>
): Highland.Stream<Record<string, unknown>> =>
  stream.map(trimKeys).map(convertDates);
