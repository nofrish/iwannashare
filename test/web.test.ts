import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadPublishConfig, writePublishConfig } from '../src/config.js';
import { parseMarkdown } from '../src/parser/markdown.js';
import { renderDefaultWebPage } from '../src/web/theme.js';
import { slugify, timestampSlug } from '../src/web/slug.js';

let previousXdgConfigHome: string | undefined;
const tempDirs: string[] = [];

afterEach(async () => {
  if (previousXdgConfigHome === undefined) {
    delete process.env.XDG_CONFIG_HOME;
  } else {
    process.env.XDG_CONFIG_HOME = previousXdgConfigHome;
  }

  await Promise.all(tempDirs.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('web share helpers', () => {
  it('slugifies ASCII titles and falls back to timestamp-friendly slugs', () => {
    expect(slugify('Hello, IWannaShare!')).toBe('hello-iwannashare');
    expect(slugify('中文标题')).toBe('');
    expect(timestampSlug(new Date('2026-06-21T08:09:10'))).toBe('share-20260621-080910');
  });

  it('renders the selected warm paper page without the old lab masthead', () => {
    const document = parseMarkdown(`---
title: 分享标题
---

正文内容。

> [!KEY]
> 关键结论。
`);

    const html = renderDefaultWebPage({ document, fontCss: '' });

    expect(html).toContain('<h1>分享标题</h1>');
    expect(html).toContain('border-top: 6px double var(--accent)');
    expect(html).toContain('iwannashare by nofrish');
    expect(html).not.toContain('IWANNASHARE WEB LAB');
    expect(html).not.toContain('class="masthead"');
  });

  it('writes and loads publish config from the user config directory', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'iws-config-'));
    tempDirs.push(tempDir);
    previousXdgConfigHome = process.env.XDG_CONFIG_HOME;
    process.env.XDG_CONFIG_HOME = tempDir;

    const repoPath = path.join(tempDir, 'pages');
    const configFile = await writePublishConfig({
      repoPath,
      baseUrl: 'https://share.example.com/',
      siteName: 'Example Share'
    });
    const raw = await readFile(configFile, 'utf8');
    const loaded = await loadPublishConfig();

    expect(raw).toContain('"baseUrl": "https://share.example.com"');
    expect(loaded.config.repoPath).toBe(repoPath);
    expect(loaded.config.branch).toBe('main');
    expect(loaded.config.contentDir).toBe('share');
    expect(loaded.config.assetsDir).toBe('assets/iwannashare');
    expect(loaded.config.siteName).toBe('Example Share');
  });
});
