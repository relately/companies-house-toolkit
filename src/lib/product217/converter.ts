import { FormatterType, Through } from '../convert.js';
import { formatProduct217 } from './formatter.js';
import { parseProduct217 } from './parser.js';
import { transformProduct217 } from './transformer.js';

export const convertProduct217 =
  (formatterType: FormatterType): Through<string, string> =>
  (stream) =>
    stream
      .through(parseProduct217)
      .through(transformProduct217)
      .through(formatProduct217(formatterType));
