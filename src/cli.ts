import { program } from 'commander';
import { lstatSync } from 'node:fs';
import {
  transformDirectory,
  transformFile,
  transformStdIn,
} from './app/transform.js';

type InputType = 'stdin' | 'file' | 'directory' | undefined;

const parseInputType = (input: string): InputType => {
  if (input === '-') {
    return 'stdin';
  }

  const stats = lstatSync(input, { throwIfNoEntry: false });

  if (!stats) {
    return undefined;
  }

  return stats.isDirectory() ? 'directory' : 'file';
};

program
  .name('cht')
  .description('CLI to convert Companies House data products to CSV and JSON');

program
  .command('transform')
  .addArgument(program.createArgument('<input>', 'the input file or directory'))
  .action((input) => {
    switch (parseInputType(input)) {
      case 'stdin':
        transformStdIn();
        break;
      case 'file':
        transformFile(input);
        break;
      case 'directory':
        transformDirectory(input);
        break;
      default:
        process.stderr.write(`File or directory "${input}" does not exist`);
        process.exit(1);
    }
  });

program.parse();
