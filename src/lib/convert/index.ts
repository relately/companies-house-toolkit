import { getProduct101SourceStream } from '../products/100/source.js';
import { parseProduct101 } from '../products/101/parser.js';
import { parseProduct183 } from '../products/183/parser.js';
import { getProduct183SourceStream } from '../products/183/source.js';
import { parseProduct216 } from '../products/216/parser.js';
import { getProduct216SourceStream } from '../products/216/source.js';
import { parseProduct217 } from '../products/217/parser.js';
import { getProduct217SourceStream } from '../products/217/source.js';
import { Product } from '../types/product.js';
import { FormatterType } from '../util/formatters/types.js';
import { SourceType } from '../util/sources/types.js';
import { convertProduct101 } from './product101.js';
import { convertProduct183 } from './product183.js';
import { convertProduct216 } from './product216.js';
import { convertProduct217 } from './product217.js';

export const getSourceStream = (product: Product, source: SourceType) => {
  switch (product) {
    case '101':
      return getProduct101SourceStream(source);
    case '183':
      return getProduct183SourceStream(source);
    case '216':
      return getProduct216SourceStream(source);
    case '217':
      return getProduct217SourceStream(source);
  }
};

export const getParser = (product: Product) => {
  switch (product) {
    case '101':
      return parseProduct101();
    case '183':
      return parseProduct183();
    case '216':
      return parseProduct216();
    case '217':
      return parseProduct217();
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
    case '216':
      return convertProduct216(formatterType);
    case '217':
      return convertProduct217(formatterType);
  }
};
