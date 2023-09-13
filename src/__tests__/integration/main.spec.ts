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
        'transform',
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
        ['transform', 'does-not-exist.csv'],
        { reject: false }
      );

      expect(stderr).toEqual(
        'File or directory "does-not-exist.csv" does not exist'
      );
      expect(exitCode).toEqual(1);
    });

    it.todo(
      'should handle a file that is not a directory or file but does exist'
    );

    it('should handle passing a directory', async () => {
      const { stdout, stderr } = await runCli([
        'transform',
        fixturePath('input/product-217'),
      ]);

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const { stdout } = await runCli(['transform', '-'], {
        inputFile: fixturePath('input/product-217/sample.csv'),
      });

      const expected = await readFile(
        fixturePath('output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(stdout).toEqual(expected);
    });

    it.todo('should handle passing a directory with multiple files');

    it.todo('should handle long files');

    it.todo('should convert to JSON');
  });
});
