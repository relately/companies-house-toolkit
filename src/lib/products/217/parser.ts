import { parse } from 'fast-csv';
import { compose } from '../../util/streams.js';

export const parseProduct217 = () =>
  compose(
    parse({
      headers: (headers) => headers.map((header) => header?.trim()),
    })
  );
