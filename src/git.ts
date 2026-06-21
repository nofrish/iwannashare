import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface GitCommandResult {
  stdout: string;
  stderr: string;
}

export async function git(cwd: string, args: string[]): Promise<GitCommandResult> {
  const { stdout, stderr } = await execFileAsync('git', args, {
    cwd,
    maxBuffer: 10 * 1024 * 1024
  });

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim()
  };
}

export async function ensureGitRepo(repoPath: string): Promise<void> {
  try {
    await git(repoPath, ['rev-parse', '--show-toplevel']);
  } catch {
    throw new Error(`${repoPath} is not a Git repository.`);
  }
}

export async function currentBranch(repoPath: string): Promise<string> {
  const result = await git(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']);
  return result.stdout;
}

export async function ensureCleanWorktree(repoPath: string): Promise<void> {
  const result = await git(repoPath, ['status', '--porcelain']);
  if (result.stdout) {
    throw new Error(
      [`Publish repository has uncommitted changes: ${repoPath}`, '', result.stdout].join('\n')
    );
  }
}

export async function commitAndPush(input: {
  repoPath: string;
  branch: string;
  paths: string[];
  message: string;
  push: boolean;
}): Promise<{ committed: boolean }> {
  await git(input.repoPath, ['add', ...input.paths]);
  const diff = await git(input.repoPath, ['diff', '--cached', '--quiet']).catch((error: unknown) => {
    if (isExitCode(error, 1)) {
      return { stdout: '', stderr: '' };
    }

    throw error;
  });

  if (diff.stdout !== '' || diff.stderr !== '') {
    throw new Error(diff.stderr || diff.stdout);
  }

  const staged = await git(input.repoPath, ['diff', '--cached', '--name-only']);
  if (!staged.stdout) {
    return { committed: false };
  }

  await git(input.repoPath, ['commit', '-m', input.message]);

  if (input.push) {
    await git(input.repoPath, ['push', 'origin', input.branch]);
  }

  return { committed: true };
}

function isExitCode(error: unknown, code: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === code
  );
}
