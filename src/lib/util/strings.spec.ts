import { describe, expect, it } from 'vitest';
import { convertToTitleCase } from './strings.js';

describe.only('convertToTitleCase', () => {
  it('should convert a string to title case', () => {
    expect(convertToTitleCase('26 POLMUIR ROAD')).toBe('26 Polmuir Road');
  });

  it('should not convert an ordinal to title case', () => {
    expect(convertToTitleCase('4TH FLOOR')).toBe('4th Floor');
    expect(convertToTitleCase('13TH')).toBe('13th');
  });

  it('should not convert a dotted acronym to title case', () => {
    expect(convertToTitleCase('P.O. BOX')).toBe('P.O. Box');
  });

  it('should not convert KPMG to title case', () => {
    expect(convertToTitleCase('KPMG')).toBe('KPMG');
  });

  it('should not convert PO BOX to title case', () => {
    expect(convertToTitleCase('PO BOX')).toBe('PO Box');
  });

  it('should convert a string with an apostrophe', () => {
    expect(convertToTitleCase("BISHOP'S")).toBe("Bishop's");
  });

  it('should convert a abbreviated string', () => {
    expect(convertToTitleCase('ST.')).toBe('St.');
  });

  it('should convert a string with a number', () => {
    expect(convertToTitleCase('Unit 1A')).toBe('Unit 1a');
  });

  it('should convert accented characters', () => {
    expect(convertToTitleCase('GaspÉ House')).toBe('Gaspé House');
  });

  it('should keep things that look like postcodes', () => {
    expect(convertToTitleCase('N-3406')).toBe('N-3406');
    expect(convertToTitleCase('E70')).toBe('E70');
  });

  it('should keep corrupted casing', () => {
    expect(convertToTitleCase('ST.SAMPSON')).toBe('St.Sampson');
  });
});
