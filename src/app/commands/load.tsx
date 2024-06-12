/* eslint-disable no-process-exit */
import { createArgument, createCommand, createOption } from 'commander';
import { render } from 'ink';
import { lstatSync } from 'node:fs';
import React from 'react';
import { Product } from '../../lib/types/product.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/util/sources/types.js';
import { Load } from '../components/Load.js';

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

const parseSourceType = (
  input: string
): DirectorySourceType | FileSourceType | undefined => {
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

type ConvertOptions = {
  product: string;
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
  additionalSource?: string;
};

export const createLoadCommand = () =>
  createCommand('load')
    .addArgument(createArgument('<input>', 'The input file or directory'))
    .addOption(
      createOption('-p, --product <product>', 'The data product to load')
        .choices(['101', '183', '216', '217'])
        .makeOptionMandatory(true)
    )
    .addOption(
      createOption('--host <host>', 'Database host').default('localhost')
    )
    .addOption(
      createOption('--database <database>', 'Database name').default('postgres')
    )
    .addOption(
      createOption('--user <user>', 'Database username').default('postgres')
    )
    .addOption(
      createOption('--password <password>', 'Database password').default(
        'password'
      )
    )
    .addOption(createOption('--port <port>', 'Database port').default('5432'))
    .addOption(
      createOption('--additional-source <source>', 'Additional source')
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

      let additionalSourceType;
      if (options.additionalSource) {
        additionalSourceType = parseSourceType(
          options.additionalSource
        ) as DirectorySourceType;

        if (!additionalSourceType) {
          process.stderr.write(
            `File or directory "${options.additionalSource}" does not exist`
          );
          process.exit(1);
        }
      }

      render(
        <Load
          sourceType={sourceType}
          additionalSourceType={additionalSourceType}
          product={product}
          connection={{
            host: options.host,
            database: options.database,
            user: options.user,
            password: options.password,
            port: options.port,
          }}
        />,
        { stdout: process.stderr }
      );
    });
