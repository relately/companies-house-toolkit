import { execa } from 'execa';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = resolve(dirname(fileURLToPath(import.meta.url)), '../../cli.ts');

export default (args: string[]) => execa('ts-node', ['--esm', cli, ...args]);
