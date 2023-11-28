import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { getConverter, getSourceStream } from './convert/index.js';
import { estimateProduct101SourceSize } from './products/101/source.js';
import { estimateProduct183SourceSize } from './products/183/source.js';
import { estimateProduct217SourceSize } from './products/217/source.js';
import { Product } from './types/product.js';
import { FormatterType } from './util/formatters/types.js';
import { SourceType } from './util/sources/types.js';
import { tap } from './util/streams.js';

type ConvertOptions = {
  source: SourceType;
  product: Product;
  formatterType: FormatterType;
  writeStream?: Writable;
};

export const convert = async (
  {
    product,
    source,
    formatterType,
    writeStream = process.stdout,
  }: ConvertOptions,
  eventEmitter: EventEmitter
) => {
  let itemBytes = 0;

  try {
    await pipeline(
      getSourceStream(product, source),
      tap((item: Buffer) => (itemBytes += Buffer.byteLength(item, 'utf8'))),
      getConverter(product, formatterType),
      tap(() => eventEmitter.emit('progress', itemBytes)),
      writeStream
    );
  } catch (error) {
    eventEmitter.emit('error', error);
  }

  eventEmitter.emit('finish');
};

export const estimateSourceSize = (product: Product, source: SourceType) => {
  switch (product) {
    case '101':
      return estimateProduct101SourceSize(source);
    case '183':
      return estimateProduct183SourceSize(source);
    case '217':
      return estimateProduct217SourceSize(source);
  }
};
