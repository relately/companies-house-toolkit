import { titleCase } from 'title-case';

const knownAcronyms = ['KPMG'];

const isAcronym = (word: string) => knownAcronyms.includes(word);
const isWord = (word: string) => word.match(/^[a-zA-Z,']+(\.)*$/);
const isOrdinal = (word: string) =>
  word.toLowerCase().match(/^\d+(st|nd|rd|th)$/) !== null;

export const convertToTitleCase = (value: string): string =>
  value
    .replace(/,(?!\s)/g, ', ')
    .split(' ')
    .map((word) =>
      (isWord(word) || isOrdinal(word)) && !isAcronym(word)
        ? titleCase(word.toLowerCase())
        : word
    )
    .join(' ');
