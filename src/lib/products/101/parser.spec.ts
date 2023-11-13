import highland from 'highland';
import { describe, expect, it } from 'vitest';
import { parseProduct101 } from './parser.js';

describe('product 101 parser', () => {
  it('should parse transactions', async () => {
    const lines =
      '00849633  050D1           20221231        20231010        20230929                                   8                33949011661\n00849983  050D1           20230331        20231010        20230929                                   1                33949691721';
    const stream = highland<string>([lines]);

    const result = await stream
      .through(parseProduct101)
      .collect()
      .toPromise(Promise);

    const expected = [
      {
        accountsMadeUpDate: '2022-12-31',
        accountsType: 'Total Exemption Full',
        companyNumber: '00849633',
        correctionMarker: '',
        gazettableDocumentType: 'D1',
        gazetteDate: '2023-10-10',
        jurisdiction: 'England/Wales',
        receivedDate: '2023-09-29',
        transactionId: '3394901166',
        transactionType: 'Accounts Made Up Date',
      },
      {
        accountsMadeUpDate: '2023-03-31',
        accountsType: 'Full Accounts',
        companyNumber: '00849983',
        correctionMarker: '',
        gazettableDocumentType: 'D1',
        gazetteDate: '2023-10-10',
        jurisdiction: 'England/Wales',
        receivedDate: '2023-09-29',
        transactionId: '3394969172',
        transactionType: 'Accounts Made Up Date',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle lines with Windows line endings', async () => {
    const line =
      '00849210  030L    19650518                20231003        20230926 23105                               RRM18 7ERO     33944092801P.L.A. (METROPOLITAN TERMINALS) LIMITED                                                                                                                         PLAMETROPOLITANTERMINAL                                     <TILBURY DOCKS\r\n<TILBURY<ESSEX<<<RM18 7ER<<<<';

    const stream = highland<string>([line]);

    const result = await stream
      .through(parseProduct101)
      .collect()
      .toPromise(Promise);

    const expected = [
      {
        accountingReferenceDate: {
          day: '31',
          month: '05',
        },
        accountsMadeUpDate: '',
        accountsType: '',
        address: {
          area: 'TILBURY',
          careOf: '',
          country: '',
          houseNameOrNumber: '',
          poBox: '',
          postTown: 'ESSEX',
          postcode: 'RM18 7ER',
          region: '',
          street: 'TILBURY DOCKS',
          suppliedCompanyName: '',
        },
        alphaKey: 'PLAMETROPOLITANTERMINAL',
        companyNumber: '00849210',
        companyStatus: 'Private Limited',
        confirmationStatementDate: '',
        correctionMarker: '',
        dateOfIncorporation: '1965-05-18',
        dissolvedMarker: 'Restored',
        gazettableDocumentType: 'L',
        gazetteDate: '2023-10-03',
        inspectMarker: '',
        jurisdiction: 'England/Wales',
        name: 'P.L.A. (METROPOLITAN TERMINALS) LIMITED',
        postcode: 'RM18 7ER',
        postcodeStatus: 'Original address as provided by company',
        receivedDate: '2023-09-26',
        transactionId: '3394409280',
        transactionType: 'Restoration',
      },
    ];

    expect(result).toEqual(expected);
  });
});
