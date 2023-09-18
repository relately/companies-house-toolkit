import { program } from 'commander';
import { lstatSync } from 'node:fs';
import { FormatterType, getFormatter } from './app/formatter.js';
import { getParser } from './app/parser.js';
import { SourceType, getSourceStream } from './app/source.js';
import { getTransformer } from './app/transformer.js';

const parseSourceType = (input: string): SourceType | undefined => {
  if (input === '-') {
    return 'stdin';
  }

  const stats = lstatSync(input, { throwIfNoEntry: false });

  if (!stats) {
    return undefined;
  }

  return stats.isDirectory() ? 'directory' : 'file';
};

const parseFormatterType = (options: Record<string, string>): FormatterType =>
  options.json || options.j ? 'json' : 'csv';

program
  .name('cht')
  .description('CLI to convert Companies House data products to CSV and JSON');

program
  .command('transform')
  .argument('<input>', 'the input file or directory')
  .option('-j, --json', 'output JSON instead of CSV', false)
  .action((input, options) => {
    const sourceType = parseSourceType(input);

    if (!sourceType) {
      process.stderr.write(`File or directory "${input}" does not exist`);
      process.exit(1);
    }

    const formatterType = parseFormatterType(options);

    getSourceStream(sourceType, input)
      .through(getParser())
      .through(getTransformer(formatterType))
      .through(getFormatter(formatterType))
      .pipe(process.stdout);
  });

program.parse();
