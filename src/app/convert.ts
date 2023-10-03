import { FormatterType, getFormatter } from './convert/formatter.js';
import { ParserType, getParser } from './convert/parser.js';
import { SourceType, getSourceStream } from './convert/source.js';
import { getTransformer } from './convert/transformer.js';

type ProgressHandler = (progress: number) => void;

export type Through<I, O = I> = (x: Highland.Stream<I>) => Highland.Stream<O>;

export const convert = (
  source: SourceType,
  parserType: ParserType,
  formatterType: FormatterType,
  onProgress?: ProgressHandler
) => {
  let itemBytes = 0;

  return getSourceStream(source)
    .tap((item) => (itemBytes += Buffer.byteLength(item, 'utf8')))
    .through(
      getParser(parserType) as Through<
        string,
        Record<string, string | boolean | number>
      >
    )
    .through(getTransformer(formatterType))
    .through(getFormatter(formatterType))
    .tap(() => (onProgress ? onProgress(itemBytes) : null))
    .pipe(process.stdout);
};
