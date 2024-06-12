import { Knex } from 'knex';
import { Product } from '../types/product.js';
import { FormatterType } from '../util/formatters/types.js';
import {
  DirectorySourceType,
  FileSourceType,
  SourceType,
} from '../util/sources/types.js';
import { compose, map } from '../util/streams.js';
import { getProduct101SourceStream } from './100/source.js';
import { product101ToDb } from './101/db.js';
import { formatProduct101 } from './101/formatter.js';
import { parseProduct101 } from './101/parser.js';
import { estimateProduct101SourceSize } from './101/source.js';
import { transformProduct101 } from './101/transformer.js';
import { product183ToDb } from './183/db.js';
import { formatProduct183 } from './183/formatter.js';
import { parseProduct183 } from './183/parser.js';
import {
  estimateProduct183SourceSize,
  getProduct183SourceStream,
} from './183/source.js';
import { transformProduct183 } from './183/transformer.js';
import { product216ToDb } from './216/db.js';
import { formatProduct216 } from './216/formatter.js';
import { parseProduct216 } from './216/parser.js';
import {
  estimateProduct216SourceSize,
  getProduct216SourceStream,
} from './216/source.js';
import { transformProduct216 } from './216/transformer.js';
import { product217ToDb } from './217/db.js';
import { formatProduct217 } from './217/formatter.js';
import { parseProduct217 } from './217/parser.js';
import {
  estimateProduct217SourceSize,
  getProduct217SourceStream,
} from './217/source.js';
import { transformProduct217 } from './217/transformer.js';
import { calculateValues } from './shared/company.js';

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

export const getTransformer = (product: Product) => {
  switch (product) {
    case '101':
      return compose(map(transformProduct101), map(calculateValues));
    case '183':
      return compose(map(transformProduct183), map(calculateValues));
    case '216':
      return compose(map(transformProduct216));
    case '217':
      return compose(map(transformProduct217), map(calculateValues));
  }
};

export const getFormatter = (
  product: Product,
  formatterType: FormatterType
) => {
  switch (product) {
    case '101':
      return formatProduct101(formatterType);
    case '183':
      return formatProduct183(formatterType);
    case '216':
      return formatProduct216(formatterType);
    case '217':
      return formatProduct217(formatterType);
  }
};

export const getDbMapper = async (
  product: Product,
  db: Knex,
  source: DirectorySourceType | FileSourceType
) => {
  switch (product) {
    case '101':
      return product101ToDb(db);
    case '183':
      return await product183ToDb(db, source);
    case '216':
      return await product216ToDb(db, source);
    case '217':
      return product217ToDb(db, source);
  }
};

export const estimateSourceSize = (product: Product, source: SourceType) => {
  switch (product) {
    case '101':
      return estimateProduct101SourceSize(source);
    case '183':
      return estimateProduct183SourceSize(source);
    case '216':
      return estimateProduct216SourceSize(source);
    case '217':
      return estimateProduct217SourceSize(source);
  }
};
