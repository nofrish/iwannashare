import { mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function ensureParentDir(filePath: string): Promise<void> {
  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true });
}

export function toFileUrl(filePath: string): string {
  return `file://${path.resolve(filePath)}`;
}
