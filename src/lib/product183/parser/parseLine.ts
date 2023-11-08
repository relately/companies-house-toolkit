import {
  mapAccountsType,
  mapCompanyStatus,
  mapInspectMarker,
  mapJurisdiction,
  mapPostcodeStatus,
  parseCompanyVariableData,
  parseDate,
} from './shared.js';
import {
  Product183Header,
  Product183LineType,
  Product183Record,
} from './types.js';

export const getLineType = (line: string): Product183LineType => {
  if (line.startsWith('AAAAAAAA')) {
    return 'header';
  }

  if (line.startsWith('99999999')) {
    return 'trailer';
  }

  if (/^\w{8} /.test(line)) {
    return 'company';
  }

  return 'unknown';
};

export const parseHeader = (line: string): Product183Header => {
  return {
    runNumber: parseInt(line.substring(8, 12)),
    fileProductionDate: parseDate(line.substring(12, 20).trim()) || '',
  };
};

const companyFields: Array<keyof Product183Record> = [
  'companyNumber',
  'name',
  'dateOfIncorporation',
  'accountsMadeUpDate',
  'confirmationStatementDate',
  'companyStatus',
  'accountingReferenceDate',
  'accountsType',
  'inspectMarker',
  'privateFundIndicator',
  'companyNumberConvertedTo',
  'postcode',
  'postcodeStatus',
  'poBox',
  'alphaKey',
  'jurisdiction',
  'address',
];

export const parseCompanyRecord = (line: string): Product183Record => ({
  companyNumber: line.substring(0, 8),
  dateOfIncorporation: parseDate(line.substring(12, 20)) || '',
  accountsMadeUpDate: parseDate(line.substring(20, 28)) || '',
  confirmationStatementDate: parseDate(line.substring(28, 36)) || '',
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

export const reorderCompanyFields = (record: Product183Record) =>
  companyFields.reduce(
    (result, field) => ({
      ...result,
      [field]: record[field],
    }),
    {} as Product183Record
  );
