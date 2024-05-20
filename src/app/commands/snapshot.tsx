/* eslint-disable no-process-exit */
import { createCommand, createOption } from 'commander';
import { render } from 'ink';
import { lstatSync } from 'node:fs';
import React from 'react';

import { FormatterType } from '../../lib/util/formatters/types.js';
import {
  DirectorySourceType,
  FileSourceType,
} from '../../lib/util/sources/types.js';
import { Snapshot } from '../components/Snapshot.js';

const parseSourceType = (
  input: string
): FileSourceType | DirectorySourceType | undefined => {
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

const parseFormatterType = (options: SnapshotOptions): FormatterType =>
  options.json || options.j ? 'json' : 'csv';

type SnapshotOptions = {
  type: 'company';
  product100Path: string;
  product101Path: string;
  product183Path: string;
  product217Path: string;
  companies?: string;
  json?: boolean;
  j?: boolean;
};

export const createSnapshotCommand = () =>
  createCommand('snapshot')
    .addOption(
      createOption('-t, --type <type>', 'The type of snapshot to generate')
        .choices(['company'])
        .makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '--product-100-path <path>',
        'Path to the alternative updates directory'
      ).makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '--product-101-path <path>',
        'Path to the updates directory'
      ).makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '--product-183-path <path>',
        'Path to the snapshot file or directory. Will select the latest snapshot if passed a directory.'
      ).makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '--product-217-path <path>',
        'Path to the snapshot directory'
      ).makeOptionMandatory(true)
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
    .action((options: SnapshotOptions) => {
      const product100Source = validateDirectoryExists(
        options.product100Path,
        '100'
      );
      const product101Source = validateDirectoryExists(
        options.product101Path,
        '101'
      );
      const product183Source = validateExists(options.product183Path, '183');
      const product217Source = validateExists(options.product217Path, '217');

      const formatterType = parseFormatterType(options);

      render(
        <Snapshot
          product183Source={product183Source}
          product101Source={product101Source}
          product100Source={product100Source}
          product217Source={product217Source}
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

const validateExists = (path: string, product: string) => {
  const source = parseSourceType(path);

  if (!source) {
    process.stderr.write(`Product ${product} path "${path}" does not exist`);
    process.exit(1);
  }

  return source;
};

const validateDirectoryExists = (path: string, product: string) => {
  const source = validateExists(path, product);

  if (source.type !== 'directory') {
    process.stderr.write(
      `Product ${product} path must be a directory, not a file`
    );
    process.exit(1);
  }

  return source;
};
