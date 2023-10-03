import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../test/fixtures/path.js';
import { captureStreamOutput } from '../test/helpers.js';
import { snapshot } from './snapshot.js';

describe('snapshot', () => {
  it('should produce valid JSON snapshot', async () => {
    for (let i = 0; i < 5; i++) {
      const output = await captureStreamOutput((writeStream) =>
        snapshot({
          snapshotSource: {
            type: 'file',
            path: fixturePath('snapshot/input/product-183/sample.dat'),
          },
          updatesSource: {
            type: 'directory',
            path: fixturePath('snapshot/input/product-101'),
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'json',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('snapshot/output/products-183-101/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(output)).toEqual(JSON.parse(expected));
    }
  });

  it('should produce valid CSV snapshot', async () => {
    const output = await captureStreamOutput((writeStream) =>
      snapshot({
        snapshotSource: {
          type: 'file',
          path: fixturePath('snapshot/input/product-183/sample.dat'),
        },
        updatesSource: {
          type: 'directory',
          path: fixturePath('snapshot/input/product-101'),
          extension: 'txt',
          fileSelection: 'all',
        },
        formatterType: 'csv',
        writeStream,
      })
    );

    const expected = await readFile(
      fixturePath('snapshot/output/products-183-101/sample-expected.csv'),
      'utf-8'
    );

    expect(output).toEqual(expected);
  });
});
