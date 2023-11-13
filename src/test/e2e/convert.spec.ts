import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../fixtures/path.js';
import runCli from './run-cli.js';

describe.concurrent(
  'convert',
  () => {
    it('should execute command', async () => {
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

    describe.concurrent(
      'product 217',
      () => {
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

        it('should handle a directory that does not contain any CSV files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('convert/input/empty'), '--product=217'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });

        it('should convert to JSON', async () => {
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
      },
      { timeout: 30000 }
    );

    describe(
      'product 183',
      () => {
        it('should handle a directory that does not contain any DAT files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('convert/input/empty'), '--product=183'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });
      },
      { timeout: 30000 }
    );

    describe(
      'product 101',
      () => {
        it('should handle a directory that does not contain any TXT files', async () => {
          const { exitCode } = await runCli(
            ['convert', fixturePath('convert/input/empty'), '--product=101'],
            { reject: false }
          );

          expect(exitCode).toEqual(1);
        });
      },
      { timeout: 30000 }
    );
  },
  { timeout: 30000 }
);
