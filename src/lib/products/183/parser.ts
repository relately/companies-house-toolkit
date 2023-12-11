import { compose, filter, map } from '../../util/streams.js';
import { getLineType, parseCompanyRecord } from './parser/parseLine.js';

export const parseProduct183 = () =>
  compose(
    filter((row: string) => getLineType(row) === 'company'),
    map(parseCompanyRecord)
  );
