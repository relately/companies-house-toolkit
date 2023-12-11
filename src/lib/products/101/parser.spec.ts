import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { describe, expect, it } from 'vitest';
import { tap } from '../../util/streams.js';
import { parseProduct101 } from './parser.js';

describe('product 101 parser', () => {
  it('should parse transactions', async () => {
    const lines = [
      '00849633  050D1           20221231        20231010        20230929                                   8                33949011661',
      '00849983  050D1           20230331        20231010        20230929                                   1                33949691721',
    ];

    let result: Record<string, string>[] = [];

    await pipeline(
      Readable.from(lines),
      parseProduct101(),
      tap((data: Record<string, string>) => {
        result.push(data);
      })
    );

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
});
