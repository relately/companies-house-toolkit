import { Through } from '../../convert.js';
import { convertDates, trimKeys } from './shared.js';

export const transformCsv: Through<
  Record<string, string | boolean | number>,
  Record<string, unknown>
> = (stream) => stream.map(trimKeys).map(convertDates);
