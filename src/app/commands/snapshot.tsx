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

const parseSnapshotProductType = (productPair: string): '183' | undefined => {
  switch (productPair) {
    case '183,101':
      return '183';
    default:
      return undefined;
  }
};

const parseUpdatesProductType = (productPair: string): '101' | undefined => {
  switch (productPair) {
    case '183,101':
      return '101';
    default:
      return undefined;
  }
};

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
  productPair: string;
  snapshotPath: string;
  updatesPath: string;
  json?: boolean;
  j?: boolean;
};

export const createSnapshotCommand = () =>
  createCommand('snapshot')
    .addOption(
      createOption(
        '-p, --product-pair <product-pair>',
        'The pair of products to combine into a snapshot. Comma separated pair of product numbers consisting of the snapshot product number followed by the snapshot number, e.g. 183,101.'
      )
        .choices(['183,101'])
        .makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '-s, --snapshot-path <snapshot>',
        'Path to the snapshot file or directory. Will select the latest snapshot if passed a directory.'
      ).makeOptionMandatory(true)
    )
    .addOption(
      createOption(
        '-u, --updates-path <updates>',
        'Path to the updates directory'
      ).makeOptionMandatory(true)
    )
    .addOption(
      createOption('-j, --json', 'Output JSON instead of CSV').default(false)
    )
    .action((options: SnapshotOptions) => {
      const snapshotParserType = parseSnapshotProductType(options.productPair);
      const updatesParserType = parseUpdatesProductType(options.productPair);

      if (!snapshotParserType || !updatesParserType) {
        process.stderr.write(`Unknown product pair "${options.productPair}"`);
        process.exit(1);
      }

      const snapshotSource = parseSourceType(options.snapshotPath);

      if (!snapshotSource) {
        process.stderr.write(
          `File or directory "${options.snapshotPath}" does not exist`
        );
        process.exit(1);
      }

      const updatesSource = parseSourceType(options.updatesPath);

      if (!updatesSource) {
        process.stderr.write(
          `File or directory "${options.updatesPath}" does not exist`
        );
        process.exit(1);
      }

      if (updatesSource.type !== 'directory') {
        process.stderr.write(`Updates path must be a directory, not a file`);
        process.exit(1);
      }

      const formatterType = parseFormatterType(options);

      render(
        <Snapshot
          snapshotSource={snapshotSource}
          updatesSource={updatesSource}
          formatterType={formatterType}
        />,
        { stdout: process.stderr }
      );
    });
