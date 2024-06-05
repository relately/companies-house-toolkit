import { parseDatFormatDate } from '../../../util/dates.js';
import {
  mapAccountsType,
  mapCompanyStatus,
  mapInspectMarker,
  mapJurisdiction,
  mapPostcodeStatus,
  parseCompanyVariableData,
} from './shared.js';
import {
  Product183Header,
  Product183LineType,
  Product183Record,
} from './types.js';

const companyLineRegex = /^\w{8} /;

export const getLineType = (line: string): Product183LineType => {
  if (line.startsWith('AAAAAAAA')) {
    return 'header';
  }

  if (line.startsWith('99999999')) {
    return 'trailer';
  }

  if (companyLineRegex.test(line)) {
    return 'company';
  }

  return 'unknown';
};

export const parseHeader = (line: string): Product183Header => {
  return {
    runNumber: parseInt(line.substring(8, 12)),
    fileProductionDate: parseDatFormatDate(line.substring(12, 20).trim()) || '',
  };
};

export const parseCompanyRecord = (line: string): Product183Record => ({
  companyNumber: line.substring(0, 8),
  dateOfIncorporation: parseDatFormatDate(line.substring(12, 20)) || '',
  accountsMadeUpDate: parseDatFormatDate(line.substring(20, 28)) || '',
  confirmationStatementDate: parseDatFormatDate(line.substring(28, 36)) || '',
  companyStatus: mapCompanyStatus(
    line.substring(0, 8),
    line.substring(36, 38).trim()
  ),
  accountingReferenceDate: {
    day: line.substring(38, 40).trim(),
    month: line.substring(40, 42).trim(),
  },
  accountsType: mapAccountsType(line.substring(66, 68).trim()),
  inspectMarker: mapInspectMarker(line.substring(69, 70)),
  privateFundIndicator: '',
  companyNumberConvertedTo: '',
  postcode: line.substring(70, 78).trim(),
  postcodeStatus: mapPostcodeStatus(line.substring(78, 79)),
  poBox: '',
  name: line.substring(90, 250).trim(),
  alphaKey: line.substring(250, 310).trim(),
  jurisdiction: mapJurisdiction(line.substring(310, 311)),
  ...parseCompanyVariableData(line.substring(311)),
});
