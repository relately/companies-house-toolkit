import { describe, expect, it } from 'vitest';
import { getLineType, parseCompanyRecord } from '../parseLine.js';
import { CompanyRecord } from '../types.js';

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

  it('should detect trailer records', () => {
    const line = '99999999653190';

    expect(getLineType(line)).toEqual('trailer');
  });

  it('should handle unknown lines', () => {
    const line = 'foo';

    expect(getLineType(line)).toEqual('unknown');
  });
});

describe('parseCompanyRecord', () => {
  it('should parse a company line', () => {
    const line =
      '00000118    185609252020073120211218 23107                         2  TN23 1DAO           ASHFORD CATTLE MARKET COMPANY LIMITED(THE)                                                                                                                      ASHFORDCATTLEMARKET                                         1<11 BANK STREET,<ASHFORD,<KENT<<<TN23 1DA<<<<';

    const expected: CompanyRecord = {
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '07',
      accountsMadeUpDate: '2020-07-31',
      accountsType: 'Small Abbreviated',
      poBox: '',
      'address.postcode': 'TN23 1DA',
      'address.houseNameOrNumber': '',
      'address.street': '11 BANK STREET',
      'address.area': 'ASHFORD',
      'address.postTown': 'KENT',
      'address.region': '',
      'address.country': '',
      'address.careOf': '',
      'address.suppliedCompanyName': '',
      'address.poBox': '',
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

    const expected: CompanyRecord = {
      companyNumber: '13948184',
      dateOfIncorporation: '2022-03-01',
      'accountingReferenceDate.day': '31',
      'accountingReferenceDate.month': '03',
      accountsMadeUpDate: '',
      accountsType: 'Type Not Available',
      poBox: '',
      'address.postcode': 'BL1 3HZ',
      'address.houseNameOrNumber': '20',
      'address.street': 'CENTRE GARDENS',
      'address.area': '',
      'address.postTown': 'BOLTON',
      'address.region': '',
      'address.country': 'UNITED KINGDOM',
      'address.careOf': '',
      'address.suppliedCompanyName': '',
      'address.poBox': '',
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
