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
          product: '217',
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
          },
          product: '217',
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

    it('should handle a directory that does not contain any CSV files', () => {
      expect(() =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/empty'),
          },
          product: '217',
          formatterType: 'csv',
        })
      ).toThrowError(
        `Directory "${fixturePath(
          'convert/input/empty'
        )}" does not contain any csv files`
      );
    });

    it('should handle a file that does not exist', () => {
      expect(() =>
        convert({
          source: {
            type: 'file',
            path: 'file-does-not-exist.csv',
          },
          product: '217',
          formatterType: 'csv',
        })
      ).toThrowError('File "file-does-not-exist.csv" does not exist');
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
          product: '217',
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
          },
          product: '217',
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
          product: '217',
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
          product: '183',
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
          },
          product: '183',
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
          product: '183',
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

    it('should handle a directory that does not contain any DAT files', () => {
      expect(() =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/empty'),
          },
          product: '183',
          formatterType: 'csv',
        })
      ).toThrowError(
        `Directory "${fixturePath(
          'convert/input/empty'
        )}" does not contain any dat files`
      );
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-183-multiple'),
          },
          product: '183',
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
          product: '183',
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
          product: '101',
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
          },
          product: '101',
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
          product: '101',
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

    it('should handle a directory that does not contain any TXT files', () => {
      expect(() =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/empty'),
          },
          product: '101',
          formatterType: 'csv',
        })
      ).toThrowError(
        `Directory "${fixturePath(
          'convert/input/empty'
        )}" does not contain any txt files`
      );
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput((writeStream) =>
        convert({
          source: {
            type: 'directory',
            path: fixturePath('convert/input/product-101-multiple'),
          },
          product: '101',
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
          product: '101',
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
