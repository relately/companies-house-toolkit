import { FormatterType, getFormatter } from './convert/formatter.js';
import { getParser } from './convert/parser.js';
import { SourceType, getSourceStream } from './convert/source.js';
import { getTransformer } from './convert/transformer.js';

export const convert = (
  source: string,
  sourceType: SourceType,
  formatterType: FormatterType
) => {
  return getSourceStream(sourceType, source)
    .through(getParser())
    .through(getTransformer(formatterType))
    .through(getFormatter(formatterType))
    .pipe(process.stdout);
};
