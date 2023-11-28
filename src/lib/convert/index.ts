import { getProduct101SourceStream } from '../products/100/source.js';
import { getProduct183SourceStream } from '../products/183/source.js';
import { getProduct217SourceStream } from '../products/217/source.js';
import { Product } from '../types/product.js';
import { FormatterType } from '../util/formatters/types.js';
import { SourceType } from '../util/sources/types.js';
import { convertProduct101 } from './product101.js';
import { convertProduct183 } from './product183.js';
import { convertProduct217 } from './product217.js';

export const getSourceStream = (product: Product, source: SourceType) => {
  switch (product) {
    case '101':
      return getProduct101SourceStream(source);
    case '183':
      return getProduct183SourceStream(source);
    case '217':
      return getProduct217SourceStream(source);
  }
};

export const getConverter = (
  product: Product,
  formatterType: FormatterType
) => {
  switch (product) {
    case '101':
      return convertProduct101(formatterType);
    case '183':
      return convertProduct183(formatterType);
    case '217':
      return convertProduct217(formatterType);
  }
};
