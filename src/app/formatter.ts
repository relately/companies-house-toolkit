import { format } from 'fast-csv';
import highland from 'highland';
import indentString from 'indent-string';

export type FormatterType = 'json' | 'csv';

export const getFormatter = (type: FormatterType) => {
  switch (type) {
    case 'json':
      return formatJson;
    case 'csv':
      return formatCsv;
  }
};

const formatJson = (stream: Highland.Stream<Record<string, unknown>>) =>
  highland(['[\n']).concat(
    stream
      .map((object) => JSON.stringify(object, undefined, 2))
      .map((json) => indentString(json, 2))
      .intersperse(',\n')
      .append('\n]\n\n')
  );

const formatCsv = (stream: Highland.Stream<Record<string, unknown>>) =>
  stream.through(format({ headers: true }));
