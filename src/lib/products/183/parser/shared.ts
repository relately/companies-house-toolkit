import { Product183Record, Product183RecordVariableData } from './types.js';

export const mapPostcodeStatus = (
  status: string
): Product183Record['postcodeStatus'] => {
  const mapping: Record<string, Product183Record['postcodeStatus']> = {
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

export const mapJurisdiction = (
  jurisdiction: string
): Product183Record['jurisdiction'] => {
  const mapping: Record<string, Product183Record['jurisdiction']> = {
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
): Product183Record['companyStatus'] => {
  const isIcOrSi =
    companyNumber.substring(0, 2) === 'IC' ||
    companyNumber.substring(0, 2) === 'SI';

  if (isIcOrSi) {
    const mapping: Record<string, Product183Record['companyStatus']> = {
      '1': 'ICVC (Securities)',
      '2': 'ICVC (Warrant)',
      '3': 'ICVC (Umbrella)',
    };

    return mapping[status];
  }

  const mapping: Record<string, Product183Record['companyStatus']> = {
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

export const mapAccountsType = (
  accountsType: string
): Product183Record['accountsType'] => {
  const mapping: Record<string, Product183Record['accountsType']> = {
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

export const mapInspectMarker = (
  inspectMarker: string
): Product183Record['inspectMarker'] | '' => {
  const mapping: Record<string, Product183Record['inspectMarker'] | ''> = {
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
): Product183Record['privateFundIndicator'] | '' => {
  const mapping: Record<string, Product183Record['privateFundIndicator']> = {
    ' ': 'The Limited Partnership has been a private fund limited partnership since commencement',
    '1': 'Changed from a limited partnership to a private fund limited partnership',
    '2': 'Not a private fund limited partnership',
  };

  return mapping[indicator] || '';
};

export const parseCompanyVariableData = (
  data: string
): Product183RecordVariableData => {
  const parts = data.substring(-1).split('<');

  const cells: Array<keyof Product183RecordVariableData['address']> = [
    'houseNameOrNumber',
    'street',
    'area',
    'postTown',
    'region',
    'country',
    'postcode',
    'careOf',
    'suppliedCompanyName',
    'poBox',
  ];

  const result: Partial<Product183RecordVariableData['address']> = {};

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const part = parts[i];
    result[cell] =
      part !== '' && part !== undefined
        ? part.replace(/,$/, '').replace(/\r\n/, '')
        : '';
  }

  return { address: result as Product183RecordVariableData['address'] };
};
