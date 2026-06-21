import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export interface PublishConfig {
  repoPath: string;
  baseUrl: string;
  branch: string;
  contentDir: string;
  assetsDir: string;
  siteName?: string;
}

export interface IwannaShareConfig {
  publish?: Partial<PublishConfig>;
}

export interface LoadedPublishConfig {
  config: PublishConfig;
  configPath: string;
}

export function configPath(): string {
  const configRoot = process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config');
  return path.join(configRoot, 'iwannashare', 'config.json');
}

export async function loadConfig(): Promise<IwannaShareConfig> {
  const filePath = configPath();
  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as IwannaShareConfig;
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return {};
    }

    throw new Error(`Failed to read ${filePath}: ${errorMessage(error)}`);
  }
}

export async function loadPublishConfig(): Promise<LoadedPublishConfig> {
  const filePath = configPath();
  const config = await loadConfig();
  const publish = config.publish;

  if (!publish?.repoPath || !publish.baseUrl) {
    throw new Error(
      [
        `Publish is not configured. Create ${filePath} first:`,
        '',
        'iws config init --repo-path /path/to/github-pages-repo --base-url https://share.example.com',
        '',
        'Required fields: publish.repoPath and publish.baseUrl.'
      ].join('\n')
    );
  }

  return {
    config: {
      repoPath: path.resolve(expandHome(publish.repoPath)),
      baseUrl: normalizeBaseUrl(publish.baseUrl),
      branch: publish.branch ?? 'main',
      contentDir: publish.contentDir ?? 'share',
      assetsDir: publish.assetsDir ?? 'assets/iwannashare',
      ...(publish.siteName === undefined ? {} : { siteName: publish.siteName })
    },
    configPath: filePath
  };
}

export async function writePublishConfig(input: {
  repoPath: string;
  baseUrl: string;
  branch?: string;
  contentDir?: string;
  assetsDir?: string;
  siteName?: string;
}): Promise<string> {
  const filePath = configPath();
  const config: IwannaShareConfig = {
    publish: {
      repoPath: path.resolve(expandHome(input.repoPath)),
      baseUrl: normalizeBaseUrl(input.baseUrl),
      branch: input.branch ?? 'main',
      contentDir: input.contentDir ?? 'share',
      assetsDir: input.assetsDir ?? 'assets/iwannashare',
      ...(input.siteName === undefined ? {} : { siteName: input.siteName })
    }
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return filePath;
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function expandHome(value: string): string {
  if (value === '~') {
    return os.homedir();
  }

  if (value.startsWith('~/')) {
    return path.join(os.homedir(), value.slice(2));
  }

  return value;
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
