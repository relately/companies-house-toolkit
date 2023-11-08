import { parse } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { allFiles, filesAfter, latestFile } from './fileSelection.js';

describe('allFiles', () => {
  it('should sort files', () => {
    const input = ['c', 'a', 'b'];

    const expected = ['a', 'b', 'c'];

    expect(allFiles(input)).toEqual(expected);
  });
});

describe('latestFile', () => {
  it('should return the latest file', () => {
    const input = ['c', 'a', 'b'];

    const expected = ['c'];

    expect(latestFile(input)).toEqual(expected);
  });
});

describe('filesAfter', () => {
  it('should return files after a date', () => {
    const input = [
      '/path/to/2021/01/01/example.dat',
      '/path/to/2021/01/02/example.dat',
      '/path/to/2021/01/03/example.dat',
    ];

    const expected = [
      '/path/to/2021/01/02/example.dat',
      '/path/to/2021/01/03/example.dat',
    ];

    expect(
      filesAfter(parse('2021/01/01', 'yyyy/MM/dd', new Date()), input)
    ).toEqual(expected);
  });

  it('should sort files', () => {
    const input = [
      '/path/to/2021/01/03/example.dat',
      '/path/to/2021/01/01/example.dat',
      '/path/to/2021/01/02/example.dat',
    ];

    const expected = [
      '/path/to/2021/01/02/example.dat',
      '/path/to/2021/01/03/example.dat',
    ];

    expect(
      filesAfter(parse('2021/01/01', 'yyyy/MM/dd', new Date()), input)
    ).toEqual(expected);
  });

  it('should throw an error if the file is not in a directory structure that represents dates', () => {
    const input = ['/path/to/example.dat'];

    expect(() =>
      filesAfter(parse('2021/01/01', 'yyyy/MM/dd', new Date()), input)
    ).toThrowError(
      'File "/path/to/example.dat" is not in a directory structure that represents dates'
    );
  });
});
