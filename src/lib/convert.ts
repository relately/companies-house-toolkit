import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { getConverter, getParser, getSourceStream } from './convert/index.js';
import { Product100Transaction } from './products/100/parser/types.js';
import { Product101Transaction } from './products/101/parser/types.js';
import { estimateProduct101SourceSize } from './products/101/source.js';
import { Product183Record } from './products/183/parser/types.js';
import { estimateProduct183SourceSize } from './products/183/source.js';
import { Product217Record } from './products/217/parser/types.js';
import { estimateProduct217SourceSize } from './products/217/source.js';
import { Product } from './types/product.js';
import { FormatterType } from './util/formatters/types.js';
import { SourceType } from './util/sources/types.js';
import { filter, tap } from './util/streams.js';

type ConvertOptions = {
  source: SourceType;
  product: Product;
  companies?: Set<string>;
  formatterType: FormatterType;
  writeStream?: Writable;
};

export const convert = async (
  {
    product,
    source,
    companies,
    formatterType,
    writeStream = process.stdout,
  }: ConvertOptions,
  eventEmitter: EventEmitter
) => {
  const shouldProcess = (
    line:
      | Product217Record
      | Product101Transaction
      | Product100Transaction
      | Product183Record
  ) => {
    if (!companies) {
      return true;
    }

    const companyNumber =
      product === '217'
        ? (line as Product217Record).CompanyNumber
        : (
            line as
              | Product101Transaction
              | Product100Transaction
              | Product183Record
          ).companyNumber;

    return companies.has(companyNumber);
  };

  let itemBytes = 0;

  try {
    await pipeline(
      getSourceStream(product, source),
      tap((item: Buffer) => (itemBytes += Buffer.byteLength(item, 'utf8'))),
      getParser(product),
      filter(
        (
          parsedLine:
            | Product217Record
            | Product101Transaction
            | Product100Transaction
            | Product183Record
        ) => {
          if (!shouldProcess(parsedLine)) {
            eventEmitter.emit('progress', itemBytes);

            return false;
          }

          return true;
        }
      ),
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
