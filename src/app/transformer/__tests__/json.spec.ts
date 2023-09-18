import { describe, expect, it } from '@jest/globals';
import highland from 'highland';
import { transformJson } from '../json.js';

const runTransformJson = (input: Record<string, unknown>[]) =>
  highland<Record<string, unknown>>(input)
    .through(transformJson)
    .collect()
    .toPromise(Promise);

describe('transformJson', () => {
  it('should trim keys', async () => {
    const input = [{ '  key  ': 'value', x: 'y' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ key: 'value', x: 'y' }]);
  });

  it('should unflatten underscore numbers', async () => {
    const input = [{ x_1: 'value1', x_2: 'value2', y: 'value3' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ x: ['value1', 'value2'], y: 'value3' }]);
  });

  it('should unflatten objects nested in underscore numbers', async () => {
    const input = [{ 'x_1.name': 'value1', 'x_2.name': 'value2', y: 'value3' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([
      { x: [{ name: 'value1' }, { name: 'value2' }], y: 'value3' },
    ]);
  });

  it('should remove empty strings from arrays', async () => {
    const input = [{ x_1: 'value1', x_2: '', y: 'value3' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ x: ['value1'], y: 'value3' }]);
  });

  it('should remove empty strings from nested arrays', async () => {
    const input = [{ 'x_1.name': 'value1', 'x_2.name': '', y: 'value3' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ x: [{ name: 'value1' }], y: 'value3' }]);
  });

  it('should convert numbers', async () => {
    const input = [{ x: '1', y: '2.3', z: '1,000' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ x: 1, y: 2.3, z: '1,000' }]);
  });

  it('should ignore company number when converting numbers', async () => {
    const input = [{ CompanyNumber: '01234567' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([{ CompanyNumber: '01234567' }]);
  });

  it('should convert dates', async () => {
    const input = [{ x: '12/12/1973', y: '1920-10-10', z: '20th October' }];

    const result = await runTransformJson(input);

    expect(result).toEqual([
      { x: '1973-12-12', y: '1920-10-10', z: '20th October' },
    ]);
  });
});
