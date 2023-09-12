import { program } from 'commander';

program
  .name('cht')
  .description('CLI to convert Companies House data products to CSV and JSON')
  .option('-d, --debug', 'output debugging information', false)
  .parse(process.argv);
