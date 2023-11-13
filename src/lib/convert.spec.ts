import { readFile } from 'fs/promises';
import { stdin } from 'mock-stdin';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fixturePath } from '../test/fixtures/path.js';
import { captureStreamOutput } from '../test/helpers.js';
import { convert } from './convert.js';

describe('convert', () => {
  let mockStdin: ReturnType<typeof stdin>;

  beforeEach(() => {
    mockStdin = stdin();
  });

  afterEach(() => {
    mockStdin.restore();
  });

  describe('product 217', () => {
    it('should convert to standardised CSV', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-217/sample.csv'),
          },
          productType: {
            product: '217',
            extension: 'csv',
            fileSelection: 'latest',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-217'),
            extension: 'csv',
            fileSelection: 'latest',
          },
          productType: {
            product: '217',
            extension: 'csv',
            fileSelection: 'latest',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const input = await readFile(
        fixturePath('convert/input/product-217/sample.csv'),
        'utf-8'
      );

      const output = await captureStreamOutput((writeStream) => {
        const converter = convert({
          source: {
            type: 'stdin',
          },
          productType: {
            product: '217',
            extension: 'csv',
            fileSelection: 'latest',
          },
          formatterType: 'csv',
          writeStream,
        });

        mockStdin.send(input).send(null);

        return converter;
      });

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should take the latest file when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-217-multiple'),
            extension: 'csv',
            fileSelection: 'latest',
          },
          productType: {
            product: '217',
            extension: 'csv',
            fileSelection: 'latest',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-217/sample.csv'),
          },
          productType: {
            product: '217',
            extension: 'csv',
            fileSelection: 'latest',
          },
          formatterType: 'json',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(output)).toEqual(JSON.parse(expected));
    });
  });

  describe('product 183', () => {
    it('should convert to standardised CSV', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-183/sample.dat'),
          },
          productType: {
            product: '183',
            extension: 'dat',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-183'),
            extension: 'dat',
            fileSelection: 'all',
          },
          productType: {
            product: '183',
            extension: 'dat',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const input = await readFile(
        fixturePath('convert/input/product-183/sample.dat'),
        'utf-8'
      );

      const output = await captureStreamOutput((writeStream) => {
        const converter = convert({
          source: {
            type: 'stdin',
          },
          productType: {
            product: '183',
            extension: 'dat',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        });

        mockStdin.send(input).send(null);

        return converter;
      });

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-183-multiple'),
            extension: 'dat',
            fileSelection: 'all',
          },
          productType: {
            product: '183',
            extension: 'dat',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-multiple-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-183/sample.dat'),
          },
          productType: {
            product: '183',
            extension: 'dat',
            fileSelection: 'all',
          },
          formatterType: 'json',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(output)).toEqual(JSON.parse(expected));
    });
  });

  describe('product 101', () => {
    it('should convert to standardised CSV', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-101/sample.txt'),
          },
          productType: {
            product: '101',
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-101'),
            extension: 'txt',
            fileSelection: 'all',
          },
          productType: {
            product: '101',
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const input = await readFile(
        fixturePath('convert/input/product-101/sample.txt'),
        'utf-8'
      );

      const output = await captureStreamOutput((writeStream) => {
        const converter = convert({
          source: {
            type: 'stdin',
          },
          productType: {
            product: '101',
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        });

        mockStdin.send(input).send(null);

        return converter;
      });

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-101-multiple'),
            extension: 'txt',
            fileSelection: 'all',
          },
          productType: {
            product: '101',
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'csv',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-multiple-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'file',
            path: fixturePath('convert/input/product-101/sample.txt'),
          },
          productType: {
            product: '101',
            extension: 'txt',
            fileSelection: 'all',
          },
          formatterType: 'json',
          writeStream,
        })
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(output)).toEqual(JSON.parse(expected));
    });
  });
});
