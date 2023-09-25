import { describe, expect, it } from '@jest/globals';
import { readFile } from 'node:fs/promises';
import { fixturePath } from './paths.js';
import runCli from './run-cli.js';

describe('cht', () => {
  it('should display the help contents', async () => {
    const { stdout } = await runCli(['--help']);

    expect(stdout).toContain('Usage: cht [options]');
  });

  describe('product 217', () => {
    it('should convert to standardised CSV', async () => {
      const { stdout } = await runCli([
        'convert',
        fixturePath('input/product-217/sample.csv'),
      ]);

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it('should handle a file that does not exist', async () => {
      const { stderr, exitCode } = await runCli(
        ['convert', 'does-not-exist.csv'],
        { reject: false }
      );

      expect(stderr).toEqual(
        'File or directory "does-not-exist.csv" does not exist'
      );
      expect(exitCode).toEqual(1);
    });

    it('should handle passing a directory', async () => {
      const { stdout } = await runCli([
        'convert',
        fixturePath('input/product-217'),
      ]);

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const { stdout } = await runCli(['convert', '-'], {
        inputFile: fixturePath('input/product-217/sample.csv'),
      });

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it('should take the latest file when passing a directory with multiple files', async () => {
      const { stdout } = await runCli([
        'convert',
        fixturePath('input/product-217-multiple'),
      ]);

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it('should handle a directory that does not contain any CSV files', async () => {
      const { exitCode, stderr } = await runCli(
        ['convert', fixturePath('input/empty')],
        { reject: false }
      );

      expect(exitCode).toEqual(1);
    });

    it('should convert to JSON', async () => {
      const { stdout } = await runCli([
        'convert',
        fixturePath('input/product-217/sample.csv'),
        '--json',
      ]);

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.json'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });
  });
});
