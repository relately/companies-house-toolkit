import { describe, expect, it } from '@jest/globals';
import { getLineType, parseLine, parseTransaction } from '../parseLine.js';
import { TransactionLine } from '../types.js';

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
      'NC001715  010B1   20220310                20220322        20220310 03103                                BT52 1BGO     33324705614TROGGS SURF SCHOOL LLP                                                                                                                                          TROGGSSURFSCHOOL                                            23/25<QUEEN STREET<<COLERAINE<<NORTHERN IRELAND<BT52 1BG<<<<';

    const expected = {
      transactionType: 'New Incorporation',
      companyNumber: 'NC001715',
      dateOfIncorporation: '2022-03-10',
      companyStatus: 'Other',
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '03',
      postcode: 'BT52 1BG',
      postcodeStatus: 'Original address as provided by company',
      jurisdiction: 'Northern Ireland',
      name: 'TROGGS SURF SCHOOL LLP',
      alphaKey: 'TROGGSSURFSCHOOL',
      'address.houseNameOrNumber': '23/25',
      'address.careOf': '',
      'address.street': 'QUEEN STREET',
      'address.area': '',
      'address.postTown': 'COLERAINE',
      'address.region': '',
      'address.postcode': 'BT52 1BG',
      'address.country': 'NORTHERN IRELAND',
      'address.poBox': '',
      'address.suppliedCompanyName': '',
      correctionMarker: '',
      gazettableDocumentType: 'B1',
      gazetteDate: '2022-03-22',
      receivedDate: '2022-03-10',
      transactionId: '3332470561',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Add Record"', () => {
    const line =
      'CE031830  020     20230328                                20230329 0                                            O     33745538501CAPITAL FOUNDATION                                                                                                                                              CAPITALFOUNDATION                                           <<<<<<<<<<';

    const expected = {
      transactionType: 'Add Record',
      companyNumber: 'CE031830',
      dateOfIncorporation: '2023-03-28',
      accountsMadeUpDate: '',
      confirmationStatementDate: '',
      companyStatus: 'Other',
      'accountingReferenceDate.day': '',
      'accountingReferenceDate.month': '',
      accountsType: '',
      inspectMarker: '',
      postcode: '',
      postcodeStatus: 'Original address as provided by company',
      jurisdiction: 'England/Wales',
      name: 'CAPITAL FOUNDATION',
      alphaKey: 'CAPITALFOUNDATION',
      'address.houseNameOrNumber': '',
      'address.careOf': '',
      'address.street': '',
      'address.area': '',
      'address.postTown': '',
      'address.region': '',
      'address.postcode': '',
      'address.country': '',
      'address.poBox': '',
      'address.suppliedCompanyName': '',
      correctionMarker: '',
      gazettableDocumentType: '',
      receivedDate: '2023-03-29',
      transactionId: '3374553850',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Restoration"', () => {
    const line =
      'NI669387  030L    20200512                20230411        20230329 23105                             0 RBT60 1HWO     33744916054ALCHEMEUS LTD                                                                                                                                                   ALCHEMEU                                                    UNIT 5<ARMAGH BUSINESS PARK<<ARMAGH<<NORTHERN IRELAND<BT60 1HW<<<<';

    const expected = {
      transactionType: 'Restoration',
      companyNumber: 'NI669387',
      dissolvedMarker: 'Restored',
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '05',
      accountsMadeUpDate: '',
      accountsType: 'Type Not Available',
      'address.area': '',
      'address.careOf': '',
      'address.country': 'NORTHERN IRELAND',
      'address.houseNameOrNumber': 'UNIT 5',
      'address.poBox': '',
      'address.postTown': 'ARMAGH',
      'address.postcode': 'BT60 1HW',
      'address.region': '',
      'address.street': 'ARMAGH BUSINESS PARK',
      'address.suppliedCompanyName': '',
      alphaKey: 'ALCHEMEU',
      companyStatus: 'Private Limited',
      correctionMarker: '',
      gazettableDocumentType: 'L',
      gazetteDate: '2023-04-11',
      inspectMarker: '',
      jurisdiction: 'Northern Ireland',
      name: 'ALCHEMEUS LTD',
      postcode: 'BT60 1HW',
      postcodeStatus: 'Original address as provided by company',
      receivedDate: '2023-03-29',
      transactionId: '3374491605',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Status"', () => {
    const line =
      '02980378  040A3                           20230404        20230328 2                                                  33742690231';

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
      transactionType: 'Accounting Reference Date',
      companyNumber: 'NI041700',
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '03',
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

    const expected = {
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
      'FC022606  090K1                                           20220713                                              O     33456781856                                                                                                                                                                                                                            ISLESTONE<ICART ROAD<<ST MARTIN<GY4 6JB<GUERNSEY<<<<<';

    const expected = {
      transactionType: 'Address',
      companyNumber: 'FC022606',
      postcode: '',
      postcodeStatus: 'Original address as provided by company',
      'address.houseNameOrNumber': 'ISLESTONE',
      'address.careOf': '',
      'address.street': 'ICART ROAD',
      'address.area': '',
      'address.postTown': 'ST MARTIN',
      'address.region': 'GY4 6JB',
      'address.postcode': '',
      'address.country': 'GUERNSEY',
      'address.poBox': '',
      'address.suppliedCompanyName': '',
      correctionMarker: '',
      jurisdiction: 'UK',
      receivedDate: '2022-07-13',
      transactionId: '3345678185',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "No Longer Used"', () => {
    const line =
      'NI000001  100A1   20220715                                20220715 0                                            O     33458386441';

    const expected = {
      transactionType: 'No Longer Used',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Amended Account"', () => {
    const line =
      'NI604203  110             20210831                        20220705                                  16                33447343504';

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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

    const expected = {
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
      'SC049134  280D3           20191231        20200804        20200715                                                    32737453733';

    const expected = {
      transactionType:
        'Gazettable Documents Submitted by Subsidiary Company Claiming Exemption from Audit or Filing of Accounts',
      companyNumber: 'SC049134',
      accountsMadeUpDate: '2019-12-31',
      correctionMarker: '',
      gazettableDocumentType: 'D3',
      gazetteDate: '2020-08-04',
      jurisdiction: 'Scotland',
      receivedDate: '2020-07-15',
      transactionId: '3273745373',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Subsidiary Company Exemption from Audit or Filing of Accounts"', () => {
    const line =
      'SC049134  290             20191231                        20200715                                                    32737459573';

    const expected = {
      transactionType:
        'Subsidiary Company Exemption from Audit or Filing of Accounts',
      companyNumber: 'SC049134',
      accountsMadeUpDate: '2019-12-31',
      correctionMarker: '',
      jurisdiction: 'Scotland',
      receivedDate: '2020-07-15',
      transactionId: '3273745957',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Change in Jurisdiction"', () => {
    const line =
      '12497281  300A4                           20230307        20230224                                                    33709638741';

    const expected = {
      transactionType: 'Change in Jurisdiction',
      companyNumber: '12497281',
      jurisdiction: 'England/Wales',
      correctionMarker: '',
      gazetteDate: '2023-03-07',
      receivedDate: '2023-02-24',
      transactionId: '3370963874',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Confirmation Statement Date"', () => {
    const line =
      'NC001536  310D4                   20200701                20200723                                                    32737646074';

    const expected = {
      correctionMarker: '',
      transactionType: 'Confirmation Statement Date',
      companyNumber: 'NC001536',
      confirmationStatementDate: '2020-07-01',
      gazettableDocumentType: 'D4',
      jurisdiction: 'Northern Ireland',
      receivedDate: '2020-07-23',
      transactionId: '3273764607',
      withUpdatesIndicator: false,
    };

    expect(parseTransaction(line)).toEqual(expected);
  });

  it('should handle "Designation as Private Fund Limited Partnership"', () => {
    const line =
      'LP023096  320                                             20230225                                                   133709500001';

    const expected = {
      transactionType: 'Designation as Private Fund Limited Partnership',
      jurisdiction: 'England/Wales',
      receivedDate: '2023-02-25',
      transactionId: '3370950000',
      companyNumber: 'LP023096',
      privateFundIndicator:
        'Changed from a limited partnership to a private fund limited partnership',
    };

    expect(parseTransaction(line)).toEqual(expected);
  });
});

describe('parseLine', () => {
  it('should pull out the parts of a line', () => {
    const line =
      'NC001715  010B1   20220310                20220322        20220310 03103                                BT52 1BGO     33324705614TROGGS SURF SCHOOL LLP                                                                                                                                          TROGGSSURFSCHOOL                                            23/25<QUEEN STREET<<COLERAINE<<NORTHERN IRELAND<BT52 1BG<<<<';

    const expected: TransactionLine = {
      companyNumber: 'NC001715',
      transactionType: '01',
      correctionMarker: '',
      gazettableDocumentType: 'B1',
      originalGazettableDocumentType: '',
      voluntaryDissolutionIndicator: '',
      dateOfIncorporation: '2022-03-10',
      accountsMadeUpDate: '',
      confirmationStatementDate: '',
      gazetteDate: '2022-03-22',
      originalDateOfPublication: '',
      receivedDate: '2022-03-10',
      companyStatus: 'Other',
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '03',
      'sicCodes.0': '',
      'sicCodes.1': '',
      'sicCodes.2': '',
      'sicCodes.3': '',
      companyNumberConvertedTo: '',
      accountsType: '',
      inspectMarker: '',
      dissolvedMarker: '',
      postcode: 'BT52 1BG',
      postcodeStatus: 'Original address as provided by company',
      poBox: '',
      countryOfOriginCode: '',
      withUpdatesIndicator: false,
      privateFundIndicator: '',
      transactionId: '3332470561',
      jurisdiction: 'Northern Ireland',
      name: 'TROGGS SURF SCHOOL LLP',
      alphaKey: 'TROGGSSURFSCHOOL',
      'address.houseNameOrNumber': '23/25',
      'address.careOf': '',
      'address.street': 'QUEEN STREET',
      'address.area': '',
      'address.postTown': 'COLERAINE',
      'address.region': '',
      'address.postcode': 'BT52 1BG',
      'address.country': 'NORTHERN IRELAND',
      'address.poBox': '',
      'address.suppliedCompanyName': '',
    };

    expect(parseLine(line)).toEqual(expected);
  });
});
