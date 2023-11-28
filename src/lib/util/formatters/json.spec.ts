import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { describe, expect, it } from 'vitest';
import { tap } from '../streams.js';
import { formatJson } from './json.js';

describe('formatJson', () => {
  it('should ignore company number when converting numbers', async () => {
    const input = [{ CompanyNumber: '01234567' }];

    const result: string = await new Promise((resolve) => {
      let output = '';

      void pipeline(
        Readable.from(input),
        formatJson(),
        tap((data: string) => {
          output += data;
        })
      ).then(() => resolve(output));
    });

    expect(JSON.parse(result)).toEqual([{ CompanyNumber: '01234567' }]);
  });
});
