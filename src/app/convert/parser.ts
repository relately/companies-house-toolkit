import { parseCsv } from './parser/csv.js';
import { parseProduct101 } from './parser/product101.js';
import { parseProduct183 } from './parser/product183.js';

type Product101ParserType = {
  product: '101';
  extension: 'txt';
  fileSelection: 'all';
};

type Product183ParserType = {
  product: '183';
  extension: 'dat';
  fileSelection: 'all';
};

type Product217ParserType = {
  product: '217';
  extension: 'csv';
  fileSelection: 'latest';
};

export type ParserType =
  | Product101ParserType
  | Product183ParserType
  | Product217ParserType;

export const getParser = (parserType: ParserType) => {
  switch (parserType.product) {
    case '101':
      return parseProduct101;
    case '183':
      return parseProduct183;
    case '217':
      return parseCsv;
  }
};
