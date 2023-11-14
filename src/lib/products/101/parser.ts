import { Through } from '../../util/types.js';
import { getLineType, parseTransaction } from './parser/parseLine.js';
import { Product101Transaction } from './parser/types.js';

export const parseProduct101: Through<string, Product101Transaction> = (
  stream
) =>
  stream
    .map((data) => data.toString().replace(/\r\n/g, ''))
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'transaction')
    .map((row) => parseTransaction(row));
