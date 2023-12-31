import EventEmitter from 'events';
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
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath('convert/input/product-217/sample.csv'),
              },
              product: '217',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-217'),
              },
              product: '217',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle a directory that does not contain any CSV files', () => {
      expect(async () => {
        const eventEmitter = new EventEmitter();
        const errorPromise = new Promise<Error>((resolve) => {
          eventEmitter.on('error', resolve);
        });

        void convert(
          {
            source: {
              type: 'directory',
              path: fixturePath('convert/input/empty'),
            },
            product: '217',
            formatterType: 'csv',
          },
          eventEmitter
        );

        const error = await errorPromise;

        expect(error.message).toEqual(
          `Directory "${fixturePath(
            'convert/input/empty'
          )}" does not contain any files matching "*.csv"`
        );
      });
    });

    it('should handle a file that does not exist', () => {
      expect(async () => {
        const eventEmitter = new EventEmitter();
        const errorPromise = new Promise<Error>((resolve) => {
          eventEmitter.on('error', resolve);
        });

        void convert(
          {
            source: {
              type: 'file',
              path: 'file-does-not-exist.csv',
            },
            product: '217',
            formatterType: 'csv',
          },
          eventEmitter
        );

        const error = await errorPromise;

        expect(error.message).toEqual(
          'File "file-does-not-exist.csv" does not exist'
        );
      });
    });

    it('should handle stdin', async () => {
      const input = await readFile(
        fixturePath('convert/input/product-217/sample.csv'),
        'utf-8'
      );

      const output = await captureStreamOutput((writeStream, eventEmitter) => {
        void convert(
          {
            source: {
              type: 'stdin',
            },
            product: '217',
            formatterType: 'csv',
            writeStream,
          },
          eventEmitter
        );

        mockStdin.send(input).send(null);
      });

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should take the latest file when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-217-multiple'),
              },
              product: '217',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-217/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath('convert/input/product-217/sample.csv'),
              },
              product: '217',
              formatterType: 'json',
              writeStream,
            },
            eventEmitter
          )
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
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath('convert/input/product-183/sample.dat'),
              },
              product: '183',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-183'),
              },
              product: '183',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
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

      const output = await captureStreamOutput((writeStream, eventEmitter) => {
        void convert(
          {
            source: {
              type: 'stdin',
            },
            product: '183',
            formatterType: 'csv',
            writeStream,
          },
          eventEmitter
        );

        mockStdin.send(input).send(null);
      });

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle a directory that does not contain any DAT files', () => {
      expect(async () => {
        const eventEmitter = new EventEmitter();
        const errorPromise = new Promise<Error>((resolve) => {
          eventEmitter.on('error', resolve);
        });

        await convert(
          {
            source: {
              type: 'directory',
              path: fixturePath('convert/input/empty'),
            },
            product: '183',
            formatterType: 'csv',
          },
          eventEmitter
        );

        const error = await errorPromise;

        expect(error.message).toEqual(
          `Directory "${fixturePath(
            'convert/input/empty'
          )}" does not contain any files matching "*.dat"`
        );
      });
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-183-multiple'),
              },
              product: '183',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-183/sample-multiple-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath('convert/input/product-183/sample.dat'),
              },
              product: '183',
              formatterType: 'json',
              writeStream,
            },
            eventEmitter
          )
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
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath(
                  'convert/input/product-101/sample_all_opt.txt'
                ),
              },
              product: '101',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle passing a directory', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-101'),
              },
              product: '101',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle stdin', async () => {
      const input = await readFile(
        fixturePath('convert/input/product-101/sample_all_opt.txt'),
        'utf-8'
      );

      const output = await captureStreamOutput((writeStream, eventEmitter) => {
        void convert(
          {
            source: {
              type: 'stdin',
            },
            product: '101',
            formatterType: 'csv',
            writeStream,
          },
          eventEmitter
        );

        mockStdin.send(input).send(null);
      });

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should handle a directory that does not contain any TXT files', () => {
      expect(async () => {
        const eventEmitter = new EventEmitter();
        const errorPromise = new Promise<Error>((resolve) => {
          eventEmitter.on('error', resolve);
        });

        void convert(
          {
            source: {
              type: 'directory',
              path: fixturePath('convert/input/empty'),
            },
            product: '101',
            formatterType: 'csv',
          },
          eventEmitter
        );

        const error = await errorPromise;

        expect(error.message).toEqual(
          `Directory "${fixturePath(
            'convert/input/empty'
          )}" does not contain any files matching "*_all_opt.txt"`
        );
      });
    });

    it('should merge all files when passing a directory with multiple files', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'directory',
                path: fixturePath('convert/input/product-101-multiple'),
              },
              product: '101',
              formatterType: 'csv',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-multiple-expected.csv'),
        'utf-8'
      );

      expect(output).toEqual(expected);
    });

    it('should convert to JSON', async () => {
      const output = await captureStreamOutput(
        (writeStream, eventEmitter) =>
          void convert(
            {
              source: {
                type: 'file',
                path: fixturePath(
                  'convert/input/product-101/sample_all_opt.txt'
                ),
              },
              product: '101',
              formatterType: 'json',
              writeStream,
            },
            eventEmitter
          )
      );

      const expected = await readFile(
        fixturePath('convert/output/product-101/sample-expected.json'),
        'utf-8'
      );

      expect(JSON.parse(output)).toEqual(JSON.parse(expected));
    });
  });
});
