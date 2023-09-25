import { format } from 'fast-csv';
import highland from 'highland';
import indentString from 'indent-string';

export type FormatterType = 'json' | 'csv';

export const getFormatter = (
  type: FormatterType,
  onRow?: (row: string) => void
) => {
  switch (type) {
    case 'json':
      return formatJson(onRow);
    case 'csv':
      return formatCsv(onRow);
  }
};

const formatJson =
  (onRow?: (row: string) => void) =>
  (stream: Highland.Stream<Record<string, unknown>>) =>
    highland(['[\n']).concat(
      stream
        .map((object) => JSON.stringify(object, undefined, 2))
        .map((json) => indentString(json, 2))
        .tap((row) => (onRow ? onRow(row) : null))
        .intersperse(',\n')
        .append('\n]\n\n')
    );

const formatCsv =
  (onRow?: (row: string) => void) =>
  (stream: Highland.Stream<Record<string, unknown>>) =>
    stream
      .through(format({ headers: true }))
      .tap((row) => (onRow ? onRow(row) : null));
