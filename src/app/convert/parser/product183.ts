import { Through } from '../../convert.js';
import {
  getLineType,
  parseCompanyRecord,
  reorderCompanyFields,
} from './product183/parseLine.js';
import { CompanyRecord } from './product183/types.js';

export const parseProduct183: Through<string, CompanyRecord> = (stream) =>
  stream
    .split()
    .compact()
    .filter((row) => getLineType(row) === 'company')
    .map(parseCompanyRecord)
    .map(reorderCompanyFields);
