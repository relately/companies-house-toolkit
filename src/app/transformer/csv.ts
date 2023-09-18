import { convertDates, trimKeys } from './shared.js';

export const transformCsv = (
  stream: Highland.Stream<Record<string, unknown>>
): Highland.Stream<Record<string, unknown>> =>
  stream.map(trimKeys).map(convertDates);
