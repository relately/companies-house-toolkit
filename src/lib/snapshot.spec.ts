import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../test/fixtures/path.js';
import { captureStreamOutput } from '../test/helpers.js';
import { snapshot } from './snapshot.js';
import { SnapshotCompany } from './snapshot/types.js';

describe('snapshot', () => {
  it('should produce valid JSON snapshot', async () => {
    const output = await captureStreamOutput((writeStream, eventEmitter) =>
      snapshot(
        {
          snapshotSource: {
            type: 'file',
            path: fixturePath('snapshot/input/product-183/sample.dat'),
          },
          updatesSource: {
            type: 'directory',
            path: fixturePath('snapshot/input/product-101'),
          },
          formatterType: 'json',
          writeStream,
        },
        eventEmitter
      )
    );

    const expected = await readFile(
      fixturePath('snapshot/output/products-183-101/sample-expected.json'),
      'utf-8'
    );

    expect(JSON.parse(output)).toEqual(JSON.parse(expected));
  });

  it('should produce valid CSV snapshot', async () => {
    const output = await captureStreamOutput((writeStream, eventEmitter) =>
      snapshot(
        {
          snapshotSource: {
            type: 'file',
            path: fixturePath('snapshot/input/product-183/sample.dat'),
          },
          updatesSource: {
            type: 'directory',
            path: fixturePath('snapshot/input/product-101'),
          },
          formatterType: 'csv',
          writeStream,
        },
        eventEmitter
      )
    );

    const expected = await readFile(
      fixturePath('snapshot/output/products-183-101/sample-expected.csv'),
      'utf-8'
    );

    expect(output).toEqual(expected);
  });

  it('should allow filtering by company number', async () => {
    const companyNumbers = ['00002120', '00005775'];

    const output = await captureStreamOutput((writeStream, eventEmitter) =>
      snapshot(
        {
          snapshotSource: {
            type: 'file',
            path: fixturePath('snapshot/input/product-183/sample.dat'),
          },
          updatesSource: {
            type: 'directory',
            path: fixturePath('snapshot/input/product-101'),
          },
          formatterType: 'json',
          companies: companyNumbers,
          writeStream,
        },
        eventEmitter
      )
    );

    const fullExpected = await readFile(
      fixturePath('snapshot/output/products-183-101/sample-expected.json'),
      'utf-8'
    );

    const fullJson = JSON.parse(fullExpected) as SnapshotCompany[];

    const expected = fullJson.filter((company) =>
      companyNumbers.includes(company.company_number)
    );

    expect(JSON.parse(output)).toEqual(expected);
  });
});
