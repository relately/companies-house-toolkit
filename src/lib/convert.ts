import EventEmitter from 'node:events';
import { Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { Product100Transaction } from './products/100/parser/types.js';
import { Product101Transaction } from './products/101/parser/types.js';
import { Product183Record } from './products/183/parser/types.js';
import { Product216Record } from './products/216/parser/types.js';
import { Product217Record } from './products/217/parser/types.js';
import {
  getFormatter,
  getParser,
  getSourceStream,
  getTransformer,
} from './products/index.js';
import { Product } from './types/product.js';
import { FormatterType } from './util/formatters/types.js';
import { SourceType } from './util/sources/types.js';
import { filter, tap } from './util/streams.js';

type ConvertOptions = {
  source: SourceType;
  product: Product;
  companies: Set<string>;
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
      | Product216Record
  ) => {
    if (companies.size === 0) {
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
            | Product216Record
        ) => {
          if (!shouldProcess(parsedLine)) {
            eventEmitter.emit('progress', itemBytes);

            return false;
          }

          return true;
        }
      ),
      getTransformer(product),
      getFormatter(product, formatterType),
      tap(() => eventEmitter.emit('progress', itemBytes)),
      writeStream
    );
  } catch (error) {
    eventEmitter.emit('error', error);
  }

  eventEmitter.emit('finish');
};
