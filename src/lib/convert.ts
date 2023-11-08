import { FormatterType } from './formatters/index.js';
import { convertProduct101 } from './product101/converter.js';
import { convertProduct183 } from './product183/converter.js';
import { convertProduct217 } from './product217/converter.js';
import { SourceType, getSourceStream } from './sources/index.js';
import { ProductType } from './types/product.js';

export { estimateSourceSize } from './sources/index.js';
export { FormatterType, ProductType, SourceType };

export type ProgressHandler = (progress: number) => void;
export type Through<I, O = I> = (x: Highland.Stream<I>) => Highland.Stream<O>;

export const convert = (
  source: SourceType,
  productType: ProductType,
  formatterType: FormatterType,
  onProgress?: ProgressHandler
) => {
  let itemBytes = 0;

  return getSourceStream(source)
    .tap((item) => (itemBytes += Buffer.byteLength(item, 'utf8')))
    .through(getConverter(productType, formatterType))
    .tap(() => (onProgress ? onProgress(itemBytes) : null))
    .pipe(process.stdout);
};

const getConverter = (
  productType: ProductType,
  formatterType: FormatterType
): Through<string, string> => {
  switch (productType.product) {
    case '101':
      return convertProduct101(formatterType);
    case '183':
      return convertProduct183(formatterType);
    case '217':
      return convertProduct217(formatterType);
  }
};
