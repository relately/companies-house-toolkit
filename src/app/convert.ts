import { FormatterType, getFormatter } from './convert/formatter.js';
import { getParser } from './convert/parser.js';
import { SourceType, getSourceStream } from './convert/source.js';
import { getTransformer } from './convert/transformer.js';

type TickHandler = (tick: string) => void;

export const convert = (
  source: string,
  sourceType: SourceType,
  formatterType: FormatterType,
  onTick?: TickHandler
) => {
  return getSourceStream(sourceType, source)
    .through(getParser())
    .through(getTransformer(formatterType))
    .through(getFormatter(formatterType))
    .tap((item) => (onTick ? onTick(item) : null))
    .pipe(process.stdout);
};
