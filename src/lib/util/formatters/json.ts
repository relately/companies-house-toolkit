import highland from 'highland';
import indentString from 'indent-string';
import { formatDates, removeEmptyValues } from '../objects.js';
import { Through } from '../types.js';

export const formatJson =
  <T extends object>(): Through<T, string> =>
  (stream) =>
    highland(['[\n']).concat(
      stream
        .map(removeEmptyValues)
        .map(formatDates)
        .map((object) => JSON.stringify(object, undefined, 2))
        .map((json) => indentString(json, 2))
        .intersperse(',\n')
        .append('\n]\n\n')
    );
