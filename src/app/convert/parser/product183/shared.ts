import { formatISO, parse } from 'date-fns';

import {
  AccountsType,
  CompanyRecord,
  CompanyStatus,
  CompanyVariableData,
  InspectMarker,
  Jurisdiction,
  PostcodeStatus,
  PrivateFundIndicator,
} from './types.js';

export const mapPostcodeStatus = (status: string): PostcodeStatus => {
  const mapping: Record<string, PostcodeStatus> = {
    A: 'Added by agent',
    B: 'Amended by agent',
    C: 'Returned to be verified',
    M: "Added by initial agent's manual system",
    O: 'Original address as provided by company',
    T: 'Outward code only added by initial agent',
    U: 'Deemed "unpostcodeable"',
    V: 'Verified and correct for given address',
    X: 'Address too long for postcode',
    Y: 'Amended original by automatic means',
    Z: 'Amended original by manual means',
  };

  return mapping[status];
};

export const mapJurisdiction = (jurisdiction: string): Jurisdiction => {
  const mapping: Record<string, Jurisdiction> = {
    '1': 'England/Wales',
    '2': 'Wales',
    '3': 'Scotland',
    '4': 'Northern Ireland',
    '5': 'European Union',
    '6': 'UK',
    '7': 'England',
    '8': 'Foreign (non-EU)',
    '9': 'Non-Jurisdictional',
  };

  return mapping[jurisdiction];
};

export const mapCompanyStatus = (
  companyNumber: string,
  status: string
): CompanyStatus => {
  const isIcOrSi =
    companyNumber.substring(0, 2) === 'IC' ||
    companyNumber.substring(0, 2) === 'SI';

  if (isIcOrSi) {
    const mapping: Record<string, CompanyStatus> = {
      '1': 'ICVC (Securities)',
      '2': 'ICVC (Warrant)',
      '3': 'ICVC (Umbrella)',
    };

    return mapping[status];
  }

  const mapping: Record<string, CompanyStatus> = {
    '1': 'Private Unlimited',
    '2': 'Private Limited',
    '3': 'PLC',
    '4': 'Old Public Company',
    '5': 'Private Company Limited by Guarantee Without Share Capital Claiming Exemption from using the word ‘LIMITED’',
    '6': 'Limited Partnership',
    '7': 'Private Limited Company Without Share Capital',
    '8': 'Company Converted / Closed',
    '9': 'Private Unlimited Company Without Share Capital',
    '0': 'Other',
    A: 'Private Company Limited by Shares Claiming Exemption from using the word ‘LIMITED’',
    B: 'Societas Europaea (SE)',
    C: 'Scottish Partnership',
    D: 'Protected Cell Company',
    E: 'Notice of details of an insolvent Further Education Corporation or Sixth Form College',
  };

  return mapping[status];
};

export const mapAccountsType = (accountsType: string): AccountsType => {
  const mapping: Record<string, AccountsType> = {
    '0': 'Type Not Available',
    '1': 'Full Accounts',
    '2': 'Small Abbreviated',
    '3': 'Medium Company',
    '4': 'Group',
    '5': 'Dormant',
    '6': 'Interim',
    '7': 'Initial',
    '8': 'Total Exemption Full',
    '9': 'Total Exemption Small Abbreviated',
    '10': 'Partial Exemption',
    '14': 'Audit Exemption Subsidiary',
    '15': 'Filing Exemption Subsidiary',
    '16': 'Micro-entity accounts',
    '17': 'Audited Abridged',
    '18': 'Unaudited Abridged',
  };

  return mapping[accountsType];
};

export const mapInspectMarker = (inspectMarker: string): InspectMarker | '' => {
  const mapping: Record<string, InspectMarker | ''> = {
    ' ': '',
    L: 'Liquidation',
    R: 'Receivership',
    P: 'Proposed conversion from PLC to SE',
    Y: 'Actual conversion from PLC to SE',
    X: 'Proposed conversion from SE to PLC',
    Z: 'Actual conversion from SE to PLC',
    N: 'Inspection no longer specifically advised',
    I: 'General Inspect Marker',
  };

  return mapping[inspectMarker];
};

export const mapPrivateFundIndicator = (
  indicator: string
): PrivateFundIndicator | '' => {
  const mapping: Record<string, PrivateFundIndicator> = {
    ' ': 'The Limited Partnership has been a private fund limited partnership since commencement',
    '1': 'Changed from a limited partnership to a private fund limited partnership',
    '2': 'Not a private fund limited partnership',
  };

  return mapping[indicator] || '';
};

export const parseDate = (dateString: string): string | undefined =>
  dateString.trim() !== '' && dateString.trim() !== '00000000'
    ? formatISO(parse(dateString, 'yyyyMMdd', 0), { representation: 'date' })
    : undefined;

export const parseCompanyVariableData = (data: string): CompanyVariableData => {
  const parts = data.substring(-1).split('<');

  const cells: Array<keyof CompanyRecord> = [
    'address.houseNameOrNumber',
    'address.street',
    'address.area',
    'address.postTown',
    'address.region',
    'address.country',
    'address.postcode',
    'address.careOf',
    'address.suppliedCompanyName',
    'address.poBox',
  ];

  return cells.reduce(
    (result, cell, index) => ({
      ...result,
      [cell]:
        parts[index] !== '' && parts[index] !== undefined
          ? parts[index].replace(/,$/, '')
          : '',
    }),
    {}
  ) as CompanyVariableData;
};
