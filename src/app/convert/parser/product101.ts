import { Through } from '../../convert.js';
import { getLineType, parseTransaction } from './product101/parseLine.js';
import { Transaction } from './product101/types.js';

export const parseProduct101: Through<string, Transaction> = (stream) =>
  stream
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'transaction')
    .map(parseTransaction);
