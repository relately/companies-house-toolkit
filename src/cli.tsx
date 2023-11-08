import { program } from 'commander';
import { createConvertCommand } from './app/commands/convert.js';
import { createSnapshotCommand } from './app/commands/snapshot.js';

program
  .name('cht')
  .description('CLI to convert Companies House data products to CSV and JSON')
  .addCommand(createConvertCommand())
  .addCommand(createSnapshotCommand());

await program.parseAsync();
