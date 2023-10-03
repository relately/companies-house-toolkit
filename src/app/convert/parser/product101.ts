import { getLineType, parseTransaction } from './product101/parseLine.js';

export const parseProduct101 = (stream: Highland.Stream<string>) =>
  stream
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'transaction')
    .map(parseTransaction)
    .map((transaction) => transaction as Record<string, unknown>);
