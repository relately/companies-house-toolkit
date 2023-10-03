import { Through } from '../convert.js';
import {
  getLineType,
  parseCompanyRecord,
  reorderCompanyFields,
} from './parser/parseLine.js';
import { Product183Record } from './parser/types.js';

export const parseProduct183: Through<string, Product183Record> = (stream) =>
  stream
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'company')
    .map(parseCompanyRecord)
    .map(reorderCompanyFields);
