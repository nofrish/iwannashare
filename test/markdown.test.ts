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

  it('parses optional web publish slug from frontmatter', () => {
    const document = parseMarkdown(`---
title: Hello
slug: hello-share
---

Body.
`);

    expect(document.meta.slug).toBe('hello-share');
  });

  it('removes a duplicate first h1 when it matches frontmatter title', () => {
    const document = parseMarkdown(`---
title: Hello
---

# Hello

Body.
`);

    expect(document.html).not.toContain('<h1>Hello</h1>');
    expect(document.html).toContain('<p>Body.</p>');
  });

  it('keeps a first h1 when it differs from frontmatter title', () => {
    const document = parseMarkdown(`---
title: Hello
---

# Different

Body.
`);

    expect(document.html).toContain('<h1>Different</h1>');
  });

  it('turns Obsidian-style callouts into semantic aside blocks', () => {
    const document = parseMarkdown(`> [!KEY]
> The central idea.
`);

    expect(document.html).toContain('class="callout callout-key"');
    expect(document.html).toContain('The central idea.');
  });
});
