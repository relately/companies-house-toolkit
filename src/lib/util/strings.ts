import { titleCase } from 'title-case';

const knownAcronyms: Record<string, boolean> = {
  KPMG: true,
  'P.O.': true,
  PO: true,
  LLP: true,
};

// Will convert any word, ordinal or number followed by a single letter to title case
export const convertToTitleCase = (value: string): string =>
  value
    .split(' ')
    .map((word) => {
      if (knownAcronyms[word]) {
        return word;
      }

      if (word.match(/\d+(st|nd|rd|th)|\d+[a-z]/i)) {
        return word.toLowerCase();
      }

      if (word.match(/\w+\d+/i)) {
        return word;
      }

      if (word.match(/\w\.\w/i)) {
        return word
          .split('.')
          .map((part) => titleCase(part.toLowerCase()))
          .join('.');
      }

      return titleCase(word.toLowerCase());
    })
    .join(' ');
