/* eslint-disable no-process-exit */
import { createArgument, createCommand, createOption } from 'commander';
import { render } from 'ink';
import { lstatSync } from 'node:fs';
import React from 'react';
import { Product } from '../../lib/types/product.js';
import { FormatterType } from '../../lib/util/formatters/types.js';
import { SourceType } from '../../lib/util/sources/types.js';
import { Convert } from '../components/Convert.js';

const parseProductType = (product: string): Product | undefined => {
  switch (product) {
    case '101':
    case '183':
    case '216':
    case '217':
      return product;
    default:
      return undefined;
  }
};

const parseSourceType = (input: string): SourceType | undefined => {
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
      }
    : { type: 'file', path: input };
};

const parseFormatterType = (options: ConvertOptions): FormatterType =>
  options.json || options.j ? 'json' : 'csv';

type ConvertOptions = {
  product: string;
  companies?: string;
  json?: boolean;
  j?: boolean;
};

export const createConvertCommand = () =>
  createCommand('convert')
    .addArgument(createArgument('<input>', 'The input file or directory'))
    .addOption(
      createOption('-p, --product <product>', 'The data product to convert')
        .choices(['101', '183', '216', '217'])
        .makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '-c, --companies <companies>',
        'Filter the snapshot to only contain the specified companies. Comma separated list of company numbers.'
      )
    )
    .addOption(
      createOption('-j, --json', 'Output JSON instead of CSV').default(false)
    )
    .action((input: string, options: ConvertOptions) => {
      const product = parseProductType(options.product);

      if (!product) {
        process.stderr.write(`Unknown product "${options.product}"`);
        process.exit(1);
      }

      const sourceType = parseSourceType(input);

      if (!sourceType) {
        process.stderr.write(`File or directory "${input}" does not exist`);
        process.exit(1);
      }

      const formatterType = parseFormatterType(options);

      render(
        <Convert
          sourceType={sourceType}
          product={product}
          formatterType={formatterType}
          companies={
            new Set(
              options.companies?.split(',').map((company) => company.trim())
            )
          }
        />,
        { stdout: process.stderr }
      );
    });
