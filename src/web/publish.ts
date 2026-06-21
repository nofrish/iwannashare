import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { PublishConfig } from '../config.js';
import { commitAndPush, currentBranch, ensureCleanWorktree, ensureGitRepo } from '../git.js';
import { parseMarkdown } from '../parser/markdown.js';
import type { ShareDocument } from '../types.js';
import { prepareWebFontAssets } from './fonts.js';
import { dateParts, slugify, timestampSlug } from './slug.js';
import { renderDefaultWebPage } from './theme.js';

export interface PublishWebOptions {
  markdown: string;
  config: PublishConfig;
  slug?: string;
  push: boolean;
  allowDirty?: boolean;
}

export interface PublishWebResult {
  url: string;
  outputDir: string;
  htmlPath: string;
  sourcePath: string;
  committed: boolean;
  document: ShareDocument;
}

export async function publishMarkdownToWeb(options: PublishWebOptions): Promise<PublishWebResult> {
  const config = options.config;
  const repoPath = path.resolve(config.repoPath);
  const now = new Date();
  const document = parseMarkdown(options.markdown);
  const title = document.meta.title ?? inferTitle(document);
  const slug = chooseSlug(options.slug, document.meta.slug, title, now);
  const { year, month } = dateParts(now);
  const relativeDir = path.join(config.contentDir, year, month, slug);
  const outputDir = path.join(repoPath, relativeDir);
  const relativeUrl = joinUrlPath(config.contentDir, year, month, slug);
  const url = `${config.baseUrl}/${relativeUrl}/`;

  await ensureGitRepo(repoPath);

  const branch = await currentBranch(repoPath);
  if (branch !== config.branch) {
    throw new Error(`Publish repo is on branch ${branch}; expected ${config.branch}.`);
  }

  if (!options.allowDirty) {
    await ensureCleanWorktree(repoPath);
  }

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const fontAssets = await prepareWebFontAssets({
    outputRoot: repoPath,
    assetsDir: config.assetsDir,
    publicAssetsPath: relativeUrlPath(relativeDir, config.assetsDir)
  });

  const html = renderDefaultWebPage({
    document,
    fontCss: fontAssets.css,
    siteName: config.siteName ?? 'IWannaShare',
    canonicalUrl: url
  });

  const htmlPath = path.join(outputDir, 'index.html');
  const sourcePath = path.join(outputDir, 'source.md');
  await writeFile(htmlPath, html, 'utf8');
  await writeFile(sourcePath, options.markdown, 'utf8');

  const committed = await commitAndPush({
    repoPath,
    branch: config.branch,
    paths: [path.relative(repoPath, outputDir), config.assetsDir],
    message: `Publish ${title}`,
    push: options.push
  });

  return {
    url,
    outputDir,
    htmlPath,
    sourcePath,
    committed: committed.committed,
    document
  };
}

function chooseSlug(
  optionSlug: string | undefined,
  metaSlug: string | undefined,
  title: string,
  date: Date
): string {
  const candidates = [optionSlug, metaSlug, slugify(title), timestampSlug(date)];
  for (const candidate of candidates) {
    const slug = candidate === undefined ? '' : slugify(candidate);
    if (slug) {
      return slug;
    }
  }

  return timestampSlug(date);
}

function inferTitle(document: ShareDocument): string {
  const firstLine = document.plainText.split(/[。！？\n]/)[0]?.trim();
  return firstLine || 'Untitled Share';
}

function joinUrlPath(...parts: string[]): string {
  return parts
    .map((part) => part.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}

function relativeUrlPath(fromDirectory: string, toDirectory: string): string {
  const relativePath = path.posix.relative(toPosix(fromDirectory), toPosix(toDirectory));
  return relativePath || '.';
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}
