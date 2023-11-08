import { parseISO } from 'date-fns';
import highland from 'highland';
import { describe, expect, it } from 'vitest';
import { formatCsv } from './csv.js';

const runFormatCsv = async (input: object[]) => {
  const csv = highland(input).through(formatCsv()).toNodeStream();

  let output = '';

  for await (const line of csv) {
    output += line.toString();
  }

  return output;
};

describe('formatCsv', () => {
  it('should convert dates', async () => {
    const input = [
      {
        x: parseISO('1973-12-12'),
        y: parseISO('1920-10-10'),
        z: '20th October',
      },
    ];

    const result = await runFormatCsv(input);

    expect(result).toEqual(
      ['x,y,z', '1973-12-12,1920-10-10,20th October'].join('\n')
    );
  });
});
