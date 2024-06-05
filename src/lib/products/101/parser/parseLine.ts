import { pick } from 'ramda';

import { parseDatFormatDate } from '../../../util/dates.js';
import {
  mapAccountsType,
  mapCompanyStatus,
  mapInspectMarker,
  mapJurisdiction,
  mapPostcodeStatus,
  mapPrivateFundIndicator,
  parseCompanyVariableData,
} from '../../183/parser/shared.js';
import {
  CorrectionMarker,
  DissolvedMarker,
  Product101Record,
  Product101Transaction,
  VoluntaryDissolutionIndicator,
} from './types.js';

type LineType = 'header' | 'transaction' | 'trailer';

export const getLineType = (line: string): LineType => {
  if (line.startsWith('AAAAAAAA')) {
    return 'header';
  }

  if (line.startsWith('99999999')) {
    return 'trailer';
  }

  return 'transaction';
};

const commonFields: Array<
  keyof Pick<
    Product101Transaction,
    'companyNumber' | 'jurisdiction' | 'transactionId' | 'receivedDate'
  >
> = ['companyNumber', 'jurisdiction', 'transactionId', 'receivedDate'];

export const parseTransaction = (line: string): Product101Transaction => {
  const data = parseLine(line);

  switch (data.transactionType) {
    case '01':
      return {
        transactionType: 'New Incorporation',
        correctionMarker: '',
        ...pick(
          [
            ...commonFields,
            'gazettableDocumentType',
            'dateOfIncorporation',
            'gazetteDate',
            'companyStatus',
            'postcode',
            'postcodeStatus',
            'name',
            'alphaKey',
            'address',
            'address.suppliedCompanyName',
            'accountingReferenceDate',
          ],
          data
        ),
      };
    case '02':
      return {
        transactionType: 'Add Record',
        correctionMarker: '',
        ...pick(
          [
            ...commonFields,
            'dateOfIncorporation',
            'companyStatus',
            'postcode',
            'postcodeStatus',
            'name',
            'alphaKey',
            'address',
            'gazettableDocumentType',
            'accountsMadeUpDate',
            'confirmationStatementDate',
            'accountingReferenceDate',
            'accountsType',
            'inspectMarker',
          ],
          data
        ),
      };
    case '03':
      return {
        transactionType: 'Restoration',
        dissolvedMarker: 'Restored',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'gazetteDate',
            'companyStatus',
            'postcode',
            'postcodeStatus',
            'name',
            'alphaKey',
            'address',
            'correctionMarker',
            'accountsMadeUpDate',
            'accountingReferenceDate',
            'accountsType',
            'inspectMarker',
            'dateOfIncorporation',
            'confirmationStatementDate',
          ],
          data
        ),
      };
    case '04':
      return {
        transactionType: 'Status',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'companyStatus',
            'gazetteDate',
          ],
          data
        ),
      };
    case '05':
      return {
        transactionType: 'Accounts Made Up Date',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'accountsMadeUpDate',
            'accountsType',
            'gazetteDate',
          ],
          data
        ),
      };
    case '06':
      return {
        transactionType: 'Annual Return Made Up Date',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'confirmationStatementDate',
          ],
          data
        ),
      };
    case '07':
      return {
        transactionType: 'Accounting Reference Date',
        ...pick(
          [...commonFields, 'correctionMarker', 'accountingReferenceDate'],
          data
        ),
      };
    case '08':
      return {
        transactionType: 'Name',
        ...pick(
          [...commonFields, 'correctionMarker', 'name', 'alphaKey'],
          data
        ),
      };
    case '09':
      return {
        transactionType: 'Address',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'postcode',
            'postcodeStatus',
            'address',
          ],
          data
        ),
      };
    case '10':
      return {
        transactionType: 'No Longer Used',
        ...pick([...commonFields], data),
      };
    case '11':
      return {
        transactionType: 'Amended Account',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'accountsMadeUpDate',
            'accountsType',
          ],
          data
        ),
      };
    case '12':
      return {
        transactionType: 'Voluntary Arrangement',
        ...pick([...commonFields, 'correctionMarker'], data),
      };
    case '13':
      return {
        transactionType: 'Date of Incorporation',
        correctionMarker: 'Companies House Correction',
        ...pick([...commonFields, 'dateOfIncorporation'], data),
      };
    case '14':
      return {
        transactionType: 'Inspect Marker',
        ...pick([...commonFields, 'correctionMarker', 'inspectMarker'], data),
      };
    case '15':
      return {
        transactionType: 'Gazettable Document Type Not Otherwise Included',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'gazetteDate',
          ],
          data
        ),
      };
    case '16':
      return {
        transactionType: 'Converted/Closed',
        ...pick([...commonFields, 'correctionMarker'], data),
      };
    case '17':
      return {
        transactionType: 'Dissolution First Gazette',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'gazetteDate',
          ],
          data
        ),
      };
    case '18':
      return {
        transactionType: 'Dissolution/Dissolution Final Gazette',
        dissolvedMarker: 'Dissolved',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'gazetteDate',
          ],
          data
        ),
      };
    case '19':
      return {
        transactionType: 'Delete',
        correctionMarker: '',
        ...pick(commonFields, data),
      };
    case '20':
      return {
        transactionType: 'SIC Codes',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'sicCodes.0',
            'sicCodes.1',
            'sicCodes.2',
            'sicCodes.3',
          ],
          data
        ),
      };
    case '21':
      return {
        transactionType: 'Country of Origin Code',
        ...pick(
          [...commonFields, 'correctionMarker', 'countryOfOriginCode'],
          data
        ),
      };
    case '22':
      return {
        transactionType: 'Full Members List',
        ...pick(
          [...commonFields, 'correctionMarker', 'confirmationStatementDate'],
          data
        ),
      };
    case '23':
      return {
        transactionType: 'Voluntary Dissolution Indicator',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'voluntaryDissolutionIndicator',
          ],
          data
        ),
      };
    case '24':
      return {
        transactionType: 'Conversion from PLC to SE or from SE to PLC',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'companyNumberConvertedTo',
            'inspectMarker',
          ],
          data
        ),
      };
    case '28':
      return {
        transactionType:
          'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'accountsMadeUpDate',
            'gazetteDate',
          ],
          data
        ),
      };
    case '29':
      return {
        transactionType:
          'Subsidiary Company Exemption from Audit or Filing of Accounts',
        ...pick(
          [...commonFields, 'correctionMarker', 'accountsMadeUpDate'],
          data
        ),
      };
    case '30':
      return {
        transactionType: 'Change in Jurisdiction',
        ...pick(
          [...commonFields, 'correctionMarker', 'gazetteDate', 'jurisdiction'],
          data
        ),
      };
    case '31':
      return {
        transactionType: 'Confirmation Statement Date',
        ...pick(
          [
            ...commonFields,
            'correctionMarker',
            'gazettableDocumentType',
            'confirmationStatementDate',
            'withUpdatesIndicator',
          ],
          data
        ),
      };
    case '32':
      return {
        transactionType: 'Designation as Private Fund Limited Partnership',
        ...pick([...commonFields, 'privateFundIndicator'], data),
      };
    default:
      console.error('Unknown transaction type', data.transactionType, line);
      throw Error('Unknown transaction type');
  }
};

const mapDissolvedMarker = (dissolvedMarker: string): DissolvedMarker => {
  const mapping: Record<string, DissolvedMarker> = {
    D: 'Dissolved',
    R: 'Restored',
  };

  return mapping[dissolvedMarker];
};

const mapCorrectionMarker = (correctionMarker: string): CorrectionMarker => {
  const mapping: Record<string, CorrectionMarker> = {
    '0': '',
    '9': 'Companies House Correction',
    '1': 'Errored Transaction',
  };

  return mapping[correctionMarker];
};

const mapVoluntaryDissolutionIndicator = (
  indicator: string
): VoluntaryDissolutionIndicator => {
  const mapping: Record<string, VoluntaryDissolutionIndicator> = {
    A: 'Application',
    W: 'Withdrawal',
    D: 'Discontinuance',
    S: 'Suspension',
  };

  return mapping[indicator];
};

export const parseLine = (line: string): Product101Record => ({
  companyNumber: line.substring(0, 8),
  transactionType: line.substring(10, 12),
  correctionMarker: mapCorrectionMarker(line.substring(12, 13)),
  gazettableDocumentType: line.substring(13, 16).trim(),
  originalGazettableDocumentType: line.substring(16, 17).trim(),
  voluntaryDissolutionIndicator:
    mapVoluntaryDissolutionIndicator(line.substring(17, 18).trim()) || '',
  dateOfIncorporation: parseDatFormatDate(line.substring(18, 26).trim()) || '',
  accountsMadeUpDate: parseDatFormatDate(line.substring(26, 34).trim()) || '',
  confirmationStatementDate:
    parseDatFormatDate(line.substring(34, 42).trim()) || '',
  gazetteDate: parseDatFormatDate(line.substring(42, 50).trim()) || '',
  originalDateOfPublication:
    parseDatFormatDate(line.substring(50, 58).trim()) || '',
  receivedDate: parseDatFormatDate(line.substring(58, 66).trim()) || '',
  companyStatus: mapCompanyStatus(
    line.substring(0, 8),
    line.substring(66, 68).trim()
  ),
  accountingReferenceDate: {
    day: line.substring(68, 70).trim(),
    month: line.substring(70, 72).trim(),
  },
  'sicCodes.0': line.substring(72, 77).trim(),
  'sicCodes.1': line.substring(77, 82).trim(),
  'sicCodes.2': line.substring(82, 87).trim(),
  'sicCodes.3': line.substring(87, 92).trim(),
  companyNumberConvertedTo: line.substring(92, 100).trim(),
  accountsType: mapAccountsType(line.substring(100, 102).trim()) || '',
  inspectMarker: mapInspectMarker(line.substring(102, 103)),
  dissolvedMarker: mapDissolvedMarker(line.substring(103, 104)) || '',
  postcode: line.substring(104, 112).trim(),
  postcodeStatus: mapPostcodeStatus(line.substring(112, 113)),
  poBox: '',
  countryOfOriginCode: line.substring(113, 116).trim(),
  withUpdatesIndicator: line.substring(116, 117).trim() === 'Y',
  privateFundIndicator: mapPrivateFundIndicator(
    line.substring(117, 118).trim()
  ),
  transactionId: line.substring(118, 128).trim(),
  jurisdiction: mapJurisdiction(line.substring(128, 129)),
  name: line.substring(129, 289).trim(),
  alphaKey: line.substring(289, 349).trim(),
  ...parseCompanyVariableData(line.substring(349)),
});
