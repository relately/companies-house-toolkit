import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';
import { fixturePath } from '../../test/fixtures/path.js';
import { getFileStream } from './sources/file.js';
import { split } from './streams.js';

describe('split', () => {
  it('should split a string by newline', async () => {
    const input = 'a\nb\nc';
    const stream = Readable.from(input);
    const result: string[] = [];

    const pipeline = stream.pipe(split()) as AsyncIterable<string>;

    for await (const line of pipeline) {
      result.push(line);
    }

    const expected = ['a', 'b', 'c'];
    expect(result).toEqual(expected);
  });

  it('should handle carriage returns', async () => {
    const input =
      '00849210  030L    19650518                20231003        20230926 23105                               RRM18 7ERO     33944092801P.L.A. (METROPOLITAN TERMINALS) LIMITED                                                                                                                         PLAMETROPOLITANTERMINAL                                     <TILBURY DOCKS' +
      '\x0D' +
      '\n' +
      '<TILBURY<ESSEX<<<RM18 7ER<<<<';
    const result: string[] = [];
    const stream = Readable.from(input);

    for await (const line of stream.pipe(split()) as AsyncIterable<string>) {
      result.push(line);
    }

    expect(result.length).toEqual(1);
  });

  it('should handle carriage returns in files', async () => {
    const path = fixturePath(
      'snapshot/input/product-101/2023/09/30/Prod101_3536_all_opt.txt'
    );

    const result: string[] = [];

    const stream = getFileStream(path).pipe(split());

    for await (const line of stream as AsyncIterable<string>) {
      result.push(line);
    }

    expect(result.length).toEqual(3);
    expect(result[1]).toEqual(
      '00849210  030L    19650518                20231003        20230926 23105                               RRM18 7ERO     33944092801P.L.A. (METROPOLITAN TERMINALS) LIMITED                                                                                                                         PLAMETROPOLITANTERMINAL                                     <TILBURY DOCKS' +
        '\r\n' +
        '<TILBURY<ESSEX<<<RM18 7ER<<<<'
    );
  });
});
