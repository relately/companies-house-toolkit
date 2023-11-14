import { parseISO } from 'date-fns';
import highland from 'highland';
import { describe, expect, it } from 'vitest';
import { formatJson } from './json.js';

const runFormatJson = (input: object[]) =>
  highland(input).through(formatJson()).collect().toPromise(Promise);

const expectJson = (actual: string[], expected: Record<string, unknown>[]) =>
  expect(JSON.parse(actual.join(''))).toEqual(expected);

describe('formatJson', () => {
  it('should ignore company number when converting numbers', async () => {
    const input = [{ CompanyNumber: '01234567' }];

    const result = await runFormatJson(input);

    expectJson(result, [{ CompanyNumber: '01234567' }]);
  });

  it('should convert dates', async () => {
    const input = [
      {
        x: parseISO('1973-12-12'),
        y: parseISO('1920-10-10'),
        z: '20th October',
      },
    ];

    const result = await runFormatJson(input);

    expectJson(result, [
      { x: '1973-12-12', y: '1920-10-10', z: '20th October' },
    ]);
  });
});
