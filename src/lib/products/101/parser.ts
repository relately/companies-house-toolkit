import { compose, filter, map } from '../../util/streams.js';
import { getLineType, parseTransaction } from './parser/parseLine.js';

export const parseProduct101 = () =>
  compose(
    filter((row: string) => getLineType(row) === 'transaction'),
    map(parseTransaction)
  );
