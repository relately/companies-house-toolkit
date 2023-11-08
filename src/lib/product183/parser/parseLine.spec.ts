import { describe, expect, it } from 'vitest';
import { getLineType, parseCompanyRecord, parseHeader } from './parseLine.js';
import { Product183Record } from './types.js';

describe('getLineType', () => {
  it('should detect header lines', () => {
    const line = 'AAAAAAAA312320220302';

    expect(getLineType(line)).toEqual('header');
  });

  it('should detect company records', () => {
    const line =
      '00000118    185609252020073120211218 23107                         2  TN23 1DAO           ASHFORD CATTLE MARKET COMPANY LIMITED(THE)                                                                                                                      ASHFORDCATTLEMARKET                                         1<11 BANK STREET,<ASHFORD,<KENT<<<TN23 1DA<<<<';

    expect(getLineType(line)).toEqual('company');
  });

  it('should detect Scottish company records', () => {
    const line =
      'SC155891    199502102021033120220210 23103                         8  DD1 4BJ O           BLACKSCROFT PROPERTY CO. LIMITED         ';

    expect(getLineType(line)).toEqual('company');
  });

  it('should detect Registered Society company records', () => {
    const line =
      'RS2699RS    190001010000000000000000 09999                         0                      SOIL SOUL AND SOCIETY CO-OPERATIVE LIMITED';

    expect(getLineType(line)).toEqual('company');
  });

  it('should detect trailer records', () => {
    const line = '99999999653190';

    expect(getLineType(line)).toEqual('trailer');
  });

  it('should handle unknown lines', () => {
    const line = 'foo';

    expect(getLineType(line)).toEqual('unknown');
  });
});

describe('parseHeader', () => {
  it('should parse the header line', () => {
    const header = 'AAAAAAAA312320220302';

    const expected = {
      runNumber: 3123,
      fileProductionDate: '2022-03-02',
    };

    expect(parseHeader(header)).toEqual(expected);
  });
});

describe('parseCompanyRecord', () => {
  it('should parse a company line', () => {
    const line =
      '00000118    185609252020073120211218 23107                         2  TN23 1DAO           ASHFORD CATTLE MARKET COMPANY LIMITED(THE)                                                                                                                      ASHFORDCATTLEMARKET                                         1<11 BANK STREET,<ASHFORD,<KENT<<<TN23 1DA<<<<';

    const expected: Product183Record = {
      accountingReferenceDate: {
        day: '31',
        month: '07',
      },
      accountsMadeUpDate: '2020-07-31',
      accountsType: 'Small Abbreviated',
      poBox: '',
      address: {
        postcode: 'TN23 1DA',
        houseNameOrNumber: '',
        street: '11 BANK STREET',
        area: 'ASHFORD',
        postTown: 'KENT',
        region: '',
        country: '',
        careOf: '',
        suppliedCompanyName: '',
        poBox: '',
      },
      alphaKey: 'ASHFORDCATTLEMARKET',
      confirmationStatementDate: '2021-12-18',
      companyNumber: '00000118',
      companyStatus: 'Private Limited',
      dateOfIncorporation: '1856-09-25',
      inspectMarker: '',
      privateFundIndicator: '',
      companyNumberConvertedTo: '',
      jurisdiction: 'England/Wales',
      name: 'ASHFORD CATTLE MARKET COMPANY LIMITED(THE)',
      postcode: 'TN23 1DA',
      postcodeStatus: 'Original address as provided by company',
    };

    expect(parseCompanyRecord(line)).toEqual(expected);
  });

  it('should parse another company line', () => {
    const line =
      '13948184    202203010000000000000000 23103                         0  BL1 3HZ O           BETTER (BOLTON) LTD                                                                                                                                             BETTERBOLTON                                                120<CENTRE GARDENS<<BOLTON<<UNITED KINGDOM<BL1 3HZ<<<<';

    const expected: Product183Record = {
      companyNumber: '13948184',
      dateOfIncorporation: '2022-03-01',
      accountingReferenceDate: {
        day: '31',
        month: '03',
      },
      accountsMadeUpDate: '',
      accountsType: 'Type Not Available',
      poBox: '',
      address: {
        postcode: 'BL1 3HZ',
        houseNameOrNumber: '20',
        street: 'CENTRE GARDENS',
        area: '',
        postTown: 'BOLTON',
        region: '',
        country: 'UNITED KINGDOM',
        careOf: '',
        suppliedCompanyName: '',
        poBox: '',
      },
      alphaKey: 'BETTERBOLTON',
      confirmationStatementDate: '',
      companyStatus: 'Private Limited',
      inspectMarker: '',
      privateFundIndicator: '',
      companyNumberConvertedTo: '',
      jurisdiction: 'England/Wales',
      name: 'BETTER (BOLTON) LTD',
      postcode: 'BL1 3HZ',
      postcodeStatus: 'Original address as provided by company',
    };

    expect(parseCompanyRecord(line)).toEqual(expected);
  });
});
