import { parse } from 'fast-csv';
import { Through } from '../convert.js';
import { trimKeys } from '../util/objects.js';
import { Product217Record } from './parser/types.js';

export const parseProduct217: Through<string, Product217Record> = (stream) =>
  stream.through(parse({ headers: true })).map(trimKeys<Product217Record>);
