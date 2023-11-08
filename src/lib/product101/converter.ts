import { FormatterType, Through } from '../convert.js';
import { formatProduct101 } from './formatter.js';
import { parseProduct101 } from './parser.js';
import { transformProduct101 } from './transformer.js';

export const convertProduct101 =
  (formatterType: FormatterType): Through<string, string> =>
  (stream) =>
    stream
      .through(parseProduct101)
      .map(transformProduct101)
      .through(formatProduct101(formatterType));
