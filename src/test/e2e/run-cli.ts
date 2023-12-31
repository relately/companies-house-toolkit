import { Options, execa } from 'execa';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = resolve(dirname(fileURLToPath(import.meta.url)), '../../cli.tsx');

export default (args: string[], options?: Options) =>
  execa('vite-node', [cli, ...args], options);
