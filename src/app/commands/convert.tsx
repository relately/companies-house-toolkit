/* eslint-disable no-process-exit */
import { createArgument, createCommand, createOption } from 'commander';
import { render } from 'ink';
import { lstatSync } from 'node:fs';
import React from 'react';
import { FormatterType, ProductType, SourceType } from '../../lib/convert.js';
import { Convert } from '../components/Convert.js';

const parseProductType = (product: string): ProductType | undefined => {
  switch (product) {
    case '101':
      return { product: '101', extension: 'txt', fileSelection: 'all' };
    case '183':
      return { product: '183', extension: 'dat', fileSelection: 'all' };
    case '217':
      return { product: '217', extension: 'csv', fileSelection: 'latest' };
    default:
      return undefined;
  }
};

const parseSourceType = (
  input: string,
  productType: ProductType
): SourceType | undefined => {
  if (input === '-') {
    return { type: 'stdin' };
  }

  const stats = lstatSync(input, { throwIfNoEntry: false });

  if (!stats) {
    return undefined;
  }

  return stats.isDirectory()
    ? {
        type: 'directory',
        path: input,
        extension: productType.extension,
        fileSelection: productType.fileSelection,
      }
    : { type: 'file', path: input };
};

const parseFormatterType = (options: ConvertOptions): FormatterType =>
  options.json || options.j ? 'json' : 'csv';

type ConvertOptions = {
  product: string;
  json?: boolean;
  j?: boolean;
};

export const createConvertCommand = () =>
  createCommand('convert')
    .addArgument(createArgument('<input>', 'The input file or directory'))
    .addOption(
      createOption('-p, --product <product>', 'The data product to convert')
        .choices(['101', '183', '217'])
        .makeOptionMandatory(true)
    )
    .addOption(
      createOption('-j, --json', 'Output JSON instead of CSV').default(false)
    )
    .action((input: string, options: ConvertOptions) => {
      const productType = parseProductType(options.product);

      if (!productType) {
        process.stderr.write(`Unknown product "${options.product}"`);
        process.exit(1);
      }

      const sourceType = parseSourceType(input, productType);

      if (!sourceType) {
        process.stderr.write(`File or directory "${input}" does not exist`);
        process.exit(1);
      }

      const formatterType = parseFormatterType(options);

      render(
        <Convert
          sourceType={sourceType}
          productType={productType}
          formatterType={formatterType}
        />,
        { stdout: process.stderr }
      );
    });
