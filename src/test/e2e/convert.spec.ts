import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../fixtures/path.js';
import runCli from './run-cli.js';

describe('convert', () => {
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
});
