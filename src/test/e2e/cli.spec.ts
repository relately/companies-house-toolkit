import { readFile } from 'fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../fixtures/path.js';
import runCli from './run-cli.js';

describe.concurrent(
  'cht',
  () => {
    it('should display the help contents', async () => {
      const { stdout } = await runCli(['--help']);

      expect(stdout).toContain('Usage: cht [options]');
    });

    it('should execute convert command', async () => {
      const { stdout } = await runCli([
        'convert',
        fixturePath('convert/input/product-217/sample.csv'),
        '--product=217',
        '--json',
      ]);

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(stdout)).toEqual(JSON.parse(expected));
    });

    it('should should execute snapshot command', async () => {
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
    });
  },
  { timeout: 30000 }
);
