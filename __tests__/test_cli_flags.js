import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

const CLI = 'node cli/bin/cli.js';

describe('CLI Enhance Flags', () => {
  it('should accept --verbose / -v flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--verbose');
  });

  it('should accept --dry-run / -n flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--dry-run');
  });

  it('should accept --output-format flag (json/text)', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--output-format');
  });

  it('should accept --config / -c flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--config');
  });

  it('should accept --no-cache flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--no-cache');
  });

  it('should accept --watch flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--watch');
  });

  it('should accept --yes / -y flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--yes');
  });

  it('should accept --log-file flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--log-file');
  });

  it('should accept --version flag', () => {
    const { stdout } = execSync(`${CLI} --help`, { encoding: 'utf8' });
    expect(stdout).toContain('--version');
  });
});
