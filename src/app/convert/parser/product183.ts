import {
  getLineType,
  parseCompanyRecord,
  reorderCompanyFields,
} from './product183/parseLine.js';

export const parseProduct183 = (stream: Highland.Stream<string>) =>
  stream
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'company')
    .map(parseCompanyRecord)
    .map(reorderCompanyFields);
