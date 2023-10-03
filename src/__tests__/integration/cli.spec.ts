import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from './paths.js';
import runCli from './run-cli.js';

describe.concurrent(
  'cht',
  () => {
    it('should display the help contents', async () => {
      const { stdout } = await runCli(['--help']);

      expect(stdout).toContain('Usage: cht [options]');
    });

    describe.concurrent(
      'product 217',
      () => {
        it('should convert to standardised CSV', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-217/sample.csv'),
            '--product=217',
          ]);

          const expected = await readFile(
            fixturePath('output/product-217/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle a file that does not exist', async () => {
          const { stderr, exitCode } = await runCli(
            ['convert', 'does-not-exist.csv', '--product=217'],
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
            '--product=217',
          ]);

          const expected = await readFile(
            fixturePath('output/product-217/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle stdin', async () => {
          const { stdout } = await runCli(['convert', '-', '--product=217'], {
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
            '--product=217',
          ]);

          const expected = await readFile(
            fixturePath('output/product-217/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle a directory that does not contain any CSV files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('input/empty'), '--product=217'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });

        it('should convert to JSON', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-217/sample.csv'),
            '--product=217',
            '--json',
          ]);

          const expected = await readFile(
            fixturePath('output/product-217/sample-expected.json'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });
      },
      { timeout: 30000 }
    );

    describe.concurrent(
      'product 183',
      () => {
        it('should convert to standardised CSV', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-183/sample.dat'),
            '--product=183',
          ]);

          const expected = await readFile(
            fixturePath('output/product-183/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle passing a directory', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-183'),
            '--product=183',
          ]);

          const expected = await readFile(
            fixturePath('output/product-183/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle stdin', async () => {
          const { stdout } = await runCli(['convert', '-', '--product=183'], {
            inputFile: fixturePath('input/product-183/sample.dat'),
          });

          const expected = await readFile(
            fixturePath('output/product-183/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should merge all files when passing a directory with multiple files', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-183-multiple'),
            '--product=183',
          ]);

          const expected = await readFile(
            fixturePath('output/product-183/sample-multiple-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle a directory that does not contain any DAT files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('input/empty'), '--product=183'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });

        it('should convert to JSON', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-183/sample.dat'),
            '--product=183',
            '--json',
          ]);

          const expected = await readFile(
            fixturePath('output/product-183/sample-expected.json'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });
      },
      { timeout: 30000 }
    );

    describe.concurrent(
      'product 101',
      () => {
        it('should convert to standardised CSV', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-101/sample.txt'),
            '--product=101',
          ]);

          const expected = await readFile(
            fixturePath('output/product-101/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle passing a directory', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-101'),
            '--product=101',
          ]);

          const expected = await readFile(
            fixturePath('output/product-101/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle stdin', async () => {
          const { stdout } = await runCli(['convert', '-', '--product=101'], {
            inputFile: fixturePath('input/product-101/sample.txt'),
          });

          const expected = await readFile(
            fixturePath('output/product-101/sample-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should merge all files when passing a directory with multiple files', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-101-multiple'),
            '--product=101',
          ]);

          const expected = await readFile(
            fixturePath('output/product-101/sample-multiple-expected.csv'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });

        it('should handle a directory that does not contain any TXT files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('input/empty'), '--product=101'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });

        it('should convert to JSON', async () => {
          const { stdout } = await runCli([
            'convert',
            fixturePath('input/product-101/sample.txt'),
            '--product=101',
            '--json',
          ]);

          const expected = await readFile(
            fixturePath('output/product-101/sample-expected.json'),
            'utf-8'
          );

          expect(stdout).toEqual(expected);
        });
      },
      { timeout: 30000 }
    );
  },
  { timeout: 30000 }
);
