import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../fixtures/path.js';
import runCli from './run-cli.js';

describe('snapshot', () => {
  it(
    'should should execute command',
    async () => {
      const { stdout } = await runCli([
        'snapshot',
        `--snapshot-path=${fixturePath(
          'snapshot/input/product-183/sample.dat'
        )}`,
        `--updates-path=${fixturePath('snapshot/input/product-101')}`,
        '--product-pair=183,101',
        `--json`,
      ]);

      const expected = await readFile(
        fixturePath('snapshot/output/products-183-101/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(stdout)).toEqual(JSON.parse(expected));
    },
    { timeout: 10000 }
  );
});
