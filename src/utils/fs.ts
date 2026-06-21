import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

export async function ensureParentDir(filePath: string): Promise<void> {
  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true });
}

export function toFileUrl(filePath: string): string {
  return `file://${path.resolve(filePath)}`;
}

export async function copyDirectory(source: string, destination: string): Promise<void> {
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
}
