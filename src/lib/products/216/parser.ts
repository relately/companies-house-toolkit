import { compose, filter, map } from '../../util/streams.js';
import { getLineType, parseOfficerRecord } from './parser/parseLine.js';

export const parseProduct216 = () =>
  compose(
    filter(
      (row: string) =>
        getLineType(row) === 'person' || getLineType(row) === 'company'
    ),
    map(parseOfficerRecord)
  );
