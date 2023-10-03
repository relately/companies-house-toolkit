import { describe, expect, it } from 'vitest';
import runCli from './run-cli.js';

describe.concurrent(
  'cht',
  () => {
    it('should display the help contents', async () => {
      const { stdout } = await runCli(['--help']);

      expect(stdout).toContain('Usage: cht [options]');
    });
  },
  { timeout: 30000 }
);
