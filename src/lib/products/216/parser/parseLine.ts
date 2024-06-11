import { parseCompanyRecord } from './company.js';
import { parsePersonRecord } from './person.js';
import { Product216LineType, Product216Record } from './types.js';

export const getLineType = (line: string): Product216LineType => {
  if (line.startsWith('DDDD')) {
    return 'header';
  }

  if (line.startsWith('99999999')) {
    return 'trailer';
  }

  if (line.charAt(8) === '1') {
    return 'company';
  } else if (line.charAt(8) === '2') {
    return 'person';
  }

  return 'unknown';
};

export const parseOfficerRecord = (line: string): Product216Record => {
  if (getLineType(line) === 'company') {
    return parseCompanyRecord(line);
  }

  return parsePersonRecord(line);
};
