import { FormatterType, Through } from '../convert.js';
import { formatProduct183 } from './formatter.js';
import { parseProduct183 } from './parser.js';
import { transformProduct183 } from './transformer.js';

export const convertProduct183 =
  (formatterType: FormatterType): Through<string, string> =>
  (stream) =>
    stream
      .through(parseProduct183)
      .through(transformProduct183)
      .through(formatProduct183(formatterType));
