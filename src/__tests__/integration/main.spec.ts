import { describe, expect, it } from '@jest/globals';
import runCli from './run-cli.js';

describe('cht', () => {
  it('should display the help contents', async () => {
    const { stdout } = await runCli(['--help']);

    expect(stdout).toContain('Usage: cht [options]');
  });
});
