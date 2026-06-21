import { execFile } from 'node:child_process';
import os from 'node:os';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function openFile(filePath: string): Promise<void> {
  if (os.platform() !== 'darwin') {
    throw new Error('Opening files is only supported on macOS.');
  }

  await execFileAsync('open', [filePath]);
}

export async function openTarget(target: string): Promise<void> {
  await openFile(target);
}
