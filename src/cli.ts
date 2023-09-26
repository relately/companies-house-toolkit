import { program } from 'commander';
import { lstatSync } from 'node:fs';
import { FormatterType } from './app/convert/formatter.js';
import { ParserType } from './app/convert/parser.js';
import { SourceType } from './app/convert/source.js';
import { renderUI } from './app/ui.js';

const parseParserType = (product: string): ParserType | undefined => {
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
  parserType: ParserType
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
        extension: parserType.extension,
        fileSelection: parserType.fileSelection,
      }
    : { type: 'file', path: input };
};

const parseFormatterType = (options: Record<string, string>): FormatterType =>
  options.json || options.j ? 'json' : 'csv';

program
  .name('cht')
  .description('CLI to convert Companies House data products to CSV and JSON');

program
  .command('convert')
  .addArgument(program.createArgument('<input>', 'the input file or directory'))
  .addOption(
    program
      .createOption('-p, --product <product>', 'the data product to convert')
      .choices(['101', '183', '217'])
      .makeOptionMandatory(true)
  )
  .addOption(
    program
      .createOption('-j, --json', 'output JSON instead of CSV')
      .default(false)
  )
  .action((input, options) => {
    const parserType = parseParserType(options.product);

    if (!parserType) {
      process.stderr.write(`Unknown product "${options.product}"`);
      process.exit(1);
    }

    const sourceType = parseSourceType(input, parserType);

    if (!sourceType) {
      process.stderr.write(`File or directory "${input}" does not exist`);
      process.exit(1);
    }

    const formatterType = parseFormatterType(options);

    renderUI({ sourceType: sourceType, parserType, formatterType });
  });

program.parse();
