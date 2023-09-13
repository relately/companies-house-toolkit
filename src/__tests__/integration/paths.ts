import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const fixturesPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  './fixtures'
);

export const fixturePath = (filename: string) => `${fixturesPath}/${filename}`;
