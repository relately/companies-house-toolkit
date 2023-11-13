import { parse } from 'fast-csv';
import { trimKeys } from '../../util/objects.js';
import { Through } from '../../util/types.js';
import { Product217Record } from './parser/types.js';

export const parseProduct217: Through<string, Product217Record> = (stream) =>
  stream.through(parse({ headers: true })).map(trimKeys<Product217Record>);
