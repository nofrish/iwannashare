import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../src/parser/markdown.js';

describe('parseMarkdown', () => {
  it('parses frontmatter and markdown content', () => {
    const document = parseMarkdown(`---
title: Hello
author: Ada
---

# Hello

This is **important**.
`);

    expect(document.meta.title).toBe('Hello');
    expect(document.meta.author).toBe('Ada');
    expect(document.html).toContain('<strong>important</strong>');
  });

  it('turns Obsidian-style callouts into semantic aside blocks', () => {
    const document = parseMarkdown(`> [!KEY]
> The central idea.
`);

    expect(document.html).toContain('class="callout callout-key"');
    expect(document.html).toContain('The central idea.');
  });
});
