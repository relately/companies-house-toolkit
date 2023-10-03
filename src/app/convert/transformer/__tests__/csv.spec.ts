import highland from 'highland';
import { describe, expect, it } from 'vitest';
import { transformCsv } from '../csv.js';

const runTransformCsv = (input: Record<string, string | number | boolean>[]) =>
  highland(input).through(transformCsv).collect().toPromise(Promise);

describe('transformCsv', () => {
  it('should trim keys', async () => {
    const input = [{ '  key  ': 'value', x: 'y' }];

    const result = await runTransformCsv(input);

    expect(result).toEqual([{ key: 'value', x: 'y' }]);
  });

  it('should convert dates', async () => {
    const input = [{ x: '12/12/1973', y: '1920-10-10', z: '20th October' }];

    const result = await runTransformCsv(input);

    expect(result).toEqual([
      { x: '1973-12-12', y: '1920-10-10', z: '20th October' },
    ]);
  });
});
