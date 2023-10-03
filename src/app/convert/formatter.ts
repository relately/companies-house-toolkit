import { format } from 'fast-csv';
import highland from 'highland';
import indentString from 'indent-string';
import { Through } from '../convert.js';

export type FormatterType = 'json' | 'csv';

export const getFormatter = (type: FormatterType) => {
  switch (type) {
    case 'json':
      return formatJson;
    case 'csv':
      return formatCsv;
  }
};

const formatJson: Through<Record<string, unknown>, string> = (stream) =>
  highland(['[\n']).concat(
    stream
      .map((object) => JSON.stringify(object, undefined, 2))
      .map((json) => indentString(json, 2))
      .intersperse(',\n')
      .append('\n]\n\n')
  );

const formatCsv: Through<Record<string, unknown>, string> = (stream) =>
  stream.through(format({ headers: true })) as Highland.Stream<string>;
