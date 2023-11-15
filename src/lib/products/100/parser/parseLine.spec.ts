import { describe, expect, it } from 'vitest';
import { getLineType, parseLine, parseTransaction } from './parseLine.js';
import { Product100Record, Product100Transaction } from './types.js';

describe('getLineType', () => {
  it('should handle a header row', () => {
    const line =
      'AAAAAAAA31302022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310202203102022031020220310';

    expect(getLineType(line)).toEqual('header');
  });

  it('should handle a trailer row', () => {
    const line = '99999999050457';

    expect(getLineType(line)).toEqual('trailer');
  });

  it('should handle a transaction row', () => {
    const line =
      'NC001715  010B1   20220310                20220322        20220310 03103                                BT52 1BGO     33324705614TROGGS SURF SCHOOL LLP                                                                                                                                          TROGGSSURFSCHOOL                                            23/25<QUEEN STREET<<COLERAINE<<NORTHERN IRELAND<BT52 1BG<<<<';

    expect(getLineType(line)).toEqual('transaction');
  });
});

describe('parseTransaction', () => {
  it('should handle "New Incorporation"', () => {
    const line =
      'NI687081  010A1   20220331                20220412        20220331 23103                                BT7 1SH O     33346810664JCA ONE HUNDRED AND FIVE LIMITED                                                                                                                                JCAONEHUNDREDANDFIVE                                                                                                                                                      C/O DNT CHARTERED ACCOUNTANTS   ORMEAU HOUSE                    BELFAST                         COUNTY ANTRIM BT7 1SH';

    const expected: Product100Transaction = {
      transactionType: 'New Incorporation',
      companyNumber: 'NI687081',
      dateOfIncorporation: '2022-03-31',
      companyStatus: 'Private Limited',
      accountingReferenceDate: {
        day: '31',
        month: '03',
      },
      postcode: 'BT7 1SH',
      postcodeStatus: 'Original address as provided by company',
      jurisdiction: 'Northern Ireland',
      name: 'JCA ONE HUNDRED AND FIVE LIMITED',
      alphaKey: 'JCAONEHUNDREDANDFIVE',
      address: {
        careOf: '',
        poBox: '',
        addressLine1: 'C/O DNT CHARTERED ACCOUNTANTS',
        addressLine2: 'ORMEAU HOUSE',
        addressLine3: 'BELFAST',
        addressLine4: 'COUNTY ANTRIM BT7 1SH',
      },
      correctionMarker: '',
      gazettableDocumentType: 'A1',
      gazetteDate: '2022-04-12',
      receivedDate: '2022-03-31',
      transactionId: '3334681066',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Add Record"', () => {
    const line =
      'RS008847  020     20220331                                20220331 0                                            O     33348890919THE FIELD CBS LIMITED                                                                                                                                           FIELDCB';

    const expected: Product100Transaction = {
      transactionType: 'Add Record',
      companyNumber: 'RS008847',
      dateOfIncorporation: '2022-03-31',
      accountsMadeUpDate: '',
      confirmationStatementDate: '',
      companyStatus: 'Other',
      accountingReferenceDate: {
        day: '',
        month: '',
      },
      accountsType: '',
      inspectMarker: '',
      postcode: '',
      postcodeStatus: 'Original address as provided by company',
      jurisdiction: 'Non-Jurisdictional',
      name: 'THE FIELD CBS LIMITED',
      alphaKey: 'FIELDCB',
      address: {
        careOf: '',
        poBox: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
      },
      correctionMarker: '',
      gazettableDocumentType: '',
      receivedDate: '2022-03-31',
      transactionId: '3334889091',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Restoration"', () => {
    const line =
      'SC292973  030L    20051109201710312015110920220412        20220331 23110                            16 RKY11 2EUO     33347930083COLINSWELL PROPERTIES LTD.                                                                                                                                      COLINSWELLPROPERTIE                                                                                                                                                       JOHN LYNCH C.A.                 TORRIDON HOUSE, TORRIDON LANE   OFF GRAMPIAN ROAD               ROSYTH KY11 2EU';

    const expected: Product100Transaction = {
      transactionType: 'Restoration',
      companyNumber: 'SC292973',
      dateOfIncorporation: '2005-11-09',
      dissolvedMarker: 'Restored',
      accountingReferenceDate: {
        day: '31',
        month: '10',
      },
      accountsMadeUpDate: '2017-10-31',
      accountsType: 'Micro-entity accounts',
      confirmationStatementDate: '2015-11-09',
      address: {
        careOf: '',
        poBox: '',
        addressLine1: 'JOHN LYNCH C.A.',
        addressLine2: 'TORRIDON HOUSE, TORRIDON LANE',
        addressLine3: 'OFF GRAMPIAN ROAD',
        addressLine4: 'ROSYTH KY11 2EU',
      },
      alphaKey: 'COLINSWELLPROPERTIE',
      companyStatus: 'Private Limited',
      correctionMarker: '',
      gazettableDocumentType: 'L',
      gazetteDate: '2022-04-12',
      inspectMarker: '',
      jurisdiction: 'Scotland',
      name: 'COLINSWELL PROPERTIES LTD.',
      postcode: 'KY11 2EU',
      postcodeStatus: 'Original address as provided by company',
      receivedDate: '2022-03-31',
      transactionId: '3334793008',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Status"', () => {
    const line =
      '02980378  040A3                           20230404        20230328 2                                                  33742690231';

    const expected: Product100Transaction = {
      transactionType: 'Status',
      companyNumber: '02980378',
      companyStatus: 'Private Limited',
      correctionMarker: '',
      jurisdiction: 'England/Wales',
      gazettableDocumentType: 'A3',
      gazetteDate: '2023-04-04',
      receivedDate: '2023-03-28',
      transactionId: '3374269023',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Accounts Made Up Date"', () => {
    const line =
      'FC008535  050             20211231                        20220708                                   4                33452450756';

    const expected: Product100Transaction = {
      transactionType: 'Accounts Made Up Date',
      companyNumber: 'FC008535',
      accountsMadeUpDate: '2021-12-31',
      accountsType: 'Group',
      gazettableDocumentType: '',
      gazetteDate: '',
      correctionMarker: '',
      jurisdiction: 'UK',
      receivedDate: '2022-07-08',
      transactionId: '3345245075',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Annual Return Made Up Date"', () => {
    const line =
      'NI605027  060D2                   20151108                20220706                                                    33458173924';

    const expected: Product100Transaction = {
      transactionType: 'Annual Return Made Up Date',
      companyNumber: 'NI605027',
      confirmationStatementDate: '2015-11-08',
      gazettableDocumentType: 'D2',
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2022-07-06',
      transactionId: '3345817392',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Accounting Reference Date"', () => {
    const line =
      'NI041700  070                                             20220715  3103                                              33458035434';

    const expected: Product100Transaction = {
      transactionType: 'Accounting Reference Date',
      companyNumber: 'NI041700',
      accountingReferenceDate: {
        day: '31',
        month: '03',
      },
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2022-07-15',
      transactionId: '3345803543',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Name"', () => {
    const line =
      'CE029704  089                                             20220715                                                    33458386441REACH OUT FOR MENTAL HEALTH CIO                                                                                                                                 REACHOUTFOURMENTALHEALTH                                        ';

    const expected: Product100Transaction = {
      transactionType: 'Name',
      companyNumber: 'CE029704',
      name: 'REACH OUT FOR MENTAL HEALTH CIO',
      alphaKey: 'REACHOUTFOURMENTALHEALTH',
      correctionMarker: 'Companies House Correction',
      jurisdiction: 'England/Wales',
      receivedDate: '2022-07-15',
      transactionId: '3345838644',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Address"', () => {
    const line =
      'FC039976  090K1                                           20230217                                      JE4 8PX O     33699123886                                                                                                                                                                                                                                                                                                                                          22 GRENVILLE STREET             ST HELIER                       JE4 8PX';

    const expected: Product100Transaction = {
      transactionType: 'Address',
      companyNumber: 'FC039976',
      postcode: 'JE4 8PX',
      postcodeStatus: 'Original address as provided by company',
      address: {
        careOf: '',
        poBox: '',
        addressLine1: '22 GRENVILLE STREET',
        addressLine2: 'ST HELIER',
        addressLine3: 'JE4 8PX',
        addressLine4: '',
      },
      correctionMarker: '',
      jurisdiction: 'UK',
      receivedDate: '2023-02-17',
      transactionId: '3369912388',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "No Longer Used"', () => {
    const line =
      'NI000001  100A1   20220715                                20220715 0                                            O     33458386441';

    const expected: Product100Transaction = {
      transactionType: 'No Longer Used',
      companyNumber: 'NI000001',
      jurisdiction: 'England/Wales',
      receivedDate: '2022-07-15',
      transactionId: '3345838644',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Amended Account"', () => {
    const line =
      'NI604203  110             20210831                        20220705                                  16                33447343504';

    const expected: Product100Transaction = {
      transactionType: 'Amended Account',
      companyNumber: 'NI604203',
      accountsMadeUpDate: '2021-08-31',
      accountsType: 'Micro-entity accounts',
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2022-07-05',
      transactionId: '3344734350',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Voluntary Arrangement"', () => {
    const line =
      'SC412336  120                                             20220714                                                    33457106873';

    const expected: Product100Transaction = {
      transactionType: 'Voluntary Arrangement',
      companyNumber: 'SC412336',
      correctionMarker: '',
      jurisdiction: 'Scotland',
      receivedDate: '2022-07-14',
      transactionId: '3345710687',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Date of Incorporation"', () => {
    const line =
      'FC039571  139     20220525                                20220713                                                    33455859356';

    const expected: Product100Transaction = {
      transactionType: 'Date of Incorporation',
      companyNumber: 'FC039571',
      dateOfIncorporation: '2022-05-25',
      correctionMarker: 'Companies House Correction',
      jurisdiction: 'UK',
      receivedDate: '2022-07-13',
      transactionId: '3345585935',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Inspect Marker"', () => {
    const line =
      'GE000180  140                                             20220706                                    L               33449003441';

    const expected: Product100Transaction = {
      transactionType: 'Inspect Marker',
      companyNumber: 'GE000180',
      inspectMarker: 'Liquidation',
      correctionMarker: '',
      jurisdiction: 'England/Wales',
      receivedDate: '2022-07-06',
      transactionId: '3344900344',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Gazettable Document Type Not Otherwise Included"', () => {
    const line =
      'FC030746  150B2                                           20220707                                                    33452084176';

    const expected: Product100Transaction = {
      transactionType: 'Gazettable Document Type Not Otherwise Included',
      companyNumber: 'FC030746',
      correctionMarker: '',
      gazettableDocumentType: 'B2',
      gazetteDate: '',
      jurisdiction: 'UK',
      receivedDate: '2022-07-07',
      transactionId: '3345208417',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Converted/Closed"', () => {
    const line =
      'FC037394  160                                             20220713                                                    33450705166';

    const expected: Product100Transaction = {
      transactionType: 'Converted/Closed',
      companyNumber: 'FC037394',
      correctionMarker: '',
      jurisdiction: 'UK',
      receivedDate: '2022-07-13',
      transactionId: '3345070516',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Dissolution First Gazette"', () => {
    const line =
      'NC000342  1701   A                        20230228        20230223                                                    33703708124';

    const expected: Product100Transaction = {
      transactionType: 'Dissolution First Gazette',
      companyNumber: 'NC000342',
      correctionMarker: '',
      gazettableDocumentType: '1',
      gazetteDate: '2023-02-28',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2023-02-23',
      transactionId: '3370370812',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Dissolution/Dissolution Final Gazette"', () => {
    const line =
      'NC001485  1802   A                        20230228        20230221                                     D              33701147524';

    const expected: Product100Transaction = {
      transactionType: 'Dissolution/Dissolution Final Gazette',
      companyNumber: 'NC001485',
      dissolvedMarker: 'Dissolved',
      correctionMarker: '',
      gazettableDocumentType: '2',
      gazetteDate: '2023-02-28',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2023-02-21',
      transactionId: '3370114752',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Delete"', () => {
    const line =
      'NC000342  1901   A                        20230228        20230223                                                    33703708124';

    const expected: Product100Transaction = {
      transactionType: 'Delete',
      companyNumber: 'NC000342',
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2023-02-23',
      transactionId: '3370370812',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "SIC Codes"', () => {
    const line =
      'NI004961  200                                             20230228      41100                                         33709816964';

    const expected: Product100Transaction = {
      transactionType: 'SIC Codes',
      companyNumber: 'NI004961',
      'sicCodes.0': '41100',
      'sicCodes.1': '',
      'sicCodes.2': '',
      'sicCodes.3': '',
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2023-02-28',
      transactionId: '3370981696',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Country of Origin Code"', () => {
    const line =
      'FC040327  210K2                                           20230221                                               USA  33701047986';

    const expected: Product100Transaction = {
      transactionType: 'Country of Origin Code',
      companyNumber: 'FC040327',
      countryOfOriginCode: 'USA',
      correctionMarker: '',
      jurisdiction: 'UK',
      receivedDate: '2023-02-21',
      transactionId: '3370104798',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Full Members List"', () => {
    const line =
      '02056066  220                     20151128                20230210                                                    33709435301';

    const expected: Product100Transaction = {
      transactionType: 'Full Members List',
      companyNumber: '02056066',
      confirmationStatementDate: '2015-11-28',
      correctionMarker: '',
      jurisdiction: 'England/Wales',
      receivedDate: '2023-02-10',
      transactionId: '3370943530',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Voluntary Dissolution Indicator"', () => {
    const line =
      'NI040442  230    A                                        20230228                                                    33708393894';

    const expected: Product100Transaction = {
      transactionType: 'Voluntary Dissolution Indicator',
      companyNumber: 'NI040442',
      voluntaryDissolutionIndicator: 'Application',
      correctionMarker: '',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2023-02-28',
      transactionId: '3370839389',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Conversion from PLC to SE or from SE to PLC"', () => {
    const line =
      '08114746  240A8                                           20200723                          SE000141  Y               32737534601';

    const expected: Product100Transaction = {
      transactionType: 'Conversion from PLC to SE or from SE to PLC',
      companyNumber: '08114746',
      companyNumberConvertedTo: 'SE000141',
      correctionMarker: '',
      inspectMarker: 'Actual conversion from PLC to SE',
      jurisdiction: 'England/Wales',
      receivedDate: '2020-07-23',
      transactionId: '3273753460',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Gazettable documents submitted by subsidiary company claiming exemption from audit or filing of accounts"', () => {
    const line =
      '13755385  280D3           20220531        20230307        20230223                                                    33706289991';

    const expected: Product100Transaction = {
      transactionType:
        'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts',
      accountsMadeUpDate: '2022-05-31',
      companyNumber: '13755385',
      correctionMarker: '',
      gazettableDocumentType: 'D3',
      gazetteDate: '2023-03-07',
      jurisdiction: 'England/Wales',
      receivedDate: '2023-02-23',
      transactionId: '3370628999',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Subsidiary Company Exemption from Audit or Filing of Accounts"', () => {
    const line =
      '13755238  290             20220531                        20230223                                                    33706281341';

    const expected: Product100Transaction = {
      transactionType:
        'Subsidiary Company Exemption from Audit or Filing of Accounts',
      accountsMadeUpDate: '2022-05-31',
      companyNumber: '13755238',
      correctionMarker: '',
      jurisdiction: 'England/Wales',
      receivedDate: '2023-02-23',
      transactionId: '3370628134',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Change in Jurisdiction"', () => {
    const line =
      '11620150  300A4                           20230307        20230222                                                    33706067041';

    const expected: Product100Transaction = {
      transactionType: 'Change in Jurisdiction',
      companyNumber: '11620150',
      jurisdiction: 'England/Wales',
      correctionMarker: '',
      gazetteDate: '2023-03-07',
      receivedDate: '2023-02-22',
      transactionId: '3370606704',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Confirmation Statement Date"', () => {
    const line =
      'SO301219  310D4                   20220225                20220331                                                    33348012883';

    const expected: Product100Transaction = {
      correctionMarker: '',
      transactionType: 'Confirmation Statement Date',
      companyNumber: 'SO301219',
      confirmationStatementDate: '2022-02-25',
      gazettableDocumentType: 'D4',
      jurisdiction: 'Scotland',
      receivedDate: '2022-03-31',
      transactionId: '3334801288',
      withUpdatesIndicator: false,
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Designation as Private Fund Limited Partnership"', () => {
    const line =
      'SL035652  320                                             20220329                                                   133346085563';

    const expected: Product100Transaction = {
      transactionType: 'Designation as Private Fund Limited Partnership',
      jurisdiction: 'Scotland',
      receivedDate: '2022-03-29',
      transactionId: '3334608556',
      companyNumber: 'SL035652',
      privateFundIndicator:
        'Changed from a limited partnership to a private fund limited partnership',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });
});

describe('parseLine', () => {
  it('should pull out the parts of a line', () => {
    const line =
      'NI687081  010A1   20220331                20220412        20220331 23103                                BT7 1SH O     33346810664JCA ONE HUNDRED AND FIVE LIMITED                                                                                                                                JCAONEHUNDREDANDFIVE                                                                                                                                                      C/O DNT CHARTERED ACCOUNTANTS   ORMEAU HOUSE                    BELFAST                         COUNTY ANTRIM BT7 1SH';

    const expected: Product100Record = {
      companyNumber: 'NI687081',
      transactionType: '01',
      correctionMarker: '',
      gazettableDocumentType: 'A1',
      originalGazettableDocumentType: '',
      voluntaryDissolutionIndicator: '',
      dateOfIncorporation: '2022-03-31',
      accountsMadeUpDate: '',
      confirmationStatementDate: '',
      gazetteDate: '2022-04-12',
      originalDateOfPublication: '',
      receivedDate: '2022-03-31',
      companyStatus: 'Private Limited',
      accountingReferenceDate: {
        day: '31',
        month: '03',
      },
      'sicCodes.0': '',
      'sicCodes.1': '',
      'sicCodes.2': '',
      'sicCodes.3': '',
      companyNumberConvertedTo: '',
      accountsType: '',
      inspectMarker: '',
      dissolvedMarker: '',
      postcode: 'BT7 1SH',
      postcodeStatus: 'Original address as provided by company',
      countryOfOriginCode: '',
      withUpdatesIndicator: false,
      privateFundIndicator: '',
      transactionId: '3334681066',
      jurisdiction: 'Northern Ireland',
      name: 'JCA ONE HUNDRED AND FIVE LIMITED',
      alphaKey: 'JCAONEHUNDREDANDFIVE',
      address: {
        careOf: '',
        poBox: '',
        addressLine1: 'C/O DNT CHARTERED ACCOUNTANTS',
        addressLine2: 'ORMEAU HOUSE',
        addressLine3: 'BELFAST',
        addressLine4: 'COUNTY ANTRIM BT7 1SH',
      },
    };

    expect(parseLine(line)).toEqual(expected);
  });
});
