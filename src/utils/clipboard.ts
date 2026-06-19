import { execFile } from 'node:child_process';
import os from 'node:os';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function copyPngToClipboard(imagePath: string): Promise<void> {
  if (os.platform() !== 'darwin') {
    throw new Error('Clipboard copy is only supported on macOS.');
  }

  await execFileAsync('osascript', [
    '-e',
    'on run argv',
    '-e',
    'set imagePath to item 1 of argv',
    '-e',
    'set the clipboard to (read (POSIX file imagePath) as «class PNGf»)',
    '-e',
    'end run',
    imagePath
  ]);
}
