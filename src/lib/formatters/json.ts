import highland from 'highland';
import indentString from 'indent-string';
import { Through } from '../convert.js';
import { formatDates, removeEmptyValues } from '../util/objects.js';

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
