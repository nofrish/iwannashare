# IWannaShare

Turn Markdown and AI responses into a polished 1080px long image for mobile sharing.

IWannaShare is a local-first CLI:

```text
Markdown -> HTML/CSS layout -> local Chrome screenshot -> PNG
```

The first release intentionally ships one theme: `default`. It is optimized for Chinese mobile reading and WeChat-style sharing.

## Quick Start

```bash
npm install
npm run doctor
npm run render:example
```

The example output is written to:

```text
examples/output/default.png
```

Render your own Markdown:

```bash
npm run dev -- ./my-note.md --output ./share.png
```

After building:

```bash
npm run build
node dist/cli.js ./my-note.md --output ./share.png
```

## Requirements

- Node.js 20+
- A Chrome-compatible browser installed locally

IWannaShare uses `playwright-core` with your system browser. It does not vendor a large Chromium binary.

Check browser availability:

```bash
npm run doctor
```

If Chrome is installed in a custom location:

```bash
npm run dev -- ./my-note.md --browser "/path/to/chrome" --output ./share.png
```

## Markdown Input

Standard Markdown is supported:

- headings
- paragraphs
- bold and emphasis
- blockquotes
- ordered and unordered lists
- inline code and code blocks
- tables via GitHub-flavored Markdown

IWannaShare also supports a small Markdown+ extension for visual callouts:

```md
> [!KEY]
> The central idea that should be visually emphasized.

> [!NOTE]
> Additional context.

> [!WARNING]
> A risk or caveat.
```

Frontmatter can provide metadata:

```md
---
title: My Share Note
date: 2026-06-19
---
```

The `title` appears as the card title. The `date` appears in the top-right corner. If `date` is omitted, IWannaShare uses the current date.

## Agent Instructions

Use this prompt when giving IWannaShare to an AI agent:

```text
You can use IWannaShare to turn a Markdown note or AI answer into a polished 1080px-wide long PNG image for mobile sharing.

Use IWannaShare when the user wants to share text-heavy content as an image: an AI answer, summary, recommendation, checklist, explanation, or note. Do not use it for diagrams, charts, photo-style images, or visual assets where the main content is not text.

Before rendering, check the local renderer once with `iws doctor`. If you are inside the IWannaShare repository, use `npm run doctor`.

Create a Markdown file, then render it with `iws <markdown-file> --output <output-file.png>`. If you are inside the repository, use `npm run dev -- <markdown-file> --output <output-file.png>`.

Markdown requirements:
- Add frontmatter with a concise `title` and, when useful, `date` in `YYYY-MM-DD` format.
- Preserve the user's meaning exactly. Do not invent facts, claims, numbers, sources, or conclusions.
- You may clean conversational wording, remove obvious filler, and improve structure, but do not change the substance.
- Prefer Chinese output when the source conversation is Chinese.
- Use standard Markdown: headings, paragraphs, bold text, ordered lists, unordered lists, inline code, code blocks, and tables.
- Keep headings short. Avoid making every paragraph a list item.
- Use callouts sparingly:
  - `> [!KEY]` for the central takeaway
  - `> [!NOTE]` for helpful context
  - `> [!WARNING]` for caveats or risks
- Do not expose callout labels as normal text; IWannaShare will render the block visually.
- For long content, preserve the important hierarchy rather than trying to compress everything into one dense paragraph.

After rendering:
- Return the PNG path.
- Return the Markdown source path.
- Mention any rendering failure and the command that failed.
- If the user asked for review, ask them to inspect the PNG before sending it to others.
```

## Release Checklist

Before publishing:

```bash
npm run check
npm run lint
npm run test
npm run build
npm audit --audit-level=moderate
npm run render:example
```

Inspect `examples/output/default.png` on a phone-sized screen before tagging a release.

Recommended release flow:

```bash
git status
npm version patch
npm publish --dry-run
npm publish
git push --follow-tags
```

For the first public release, also verify:

- package name and license are correct
- README examples work from a clean clone
- generated PNG does not require network access
- Chrome discovery works via `npm run doctor`
- no experimental theme commands are documented

## Architecture

```text
src/
  cli.ts                  CLI entry
  parser/markdown.ts      Markdown and Markdown+ parser
  renderer/browser.ts     System Chrome discovery and screenshot renderer
  renderer/render.ts      End-to-end render pipeline
  themes/                 Default theme and shared long-image layout
```

The renderer is intentionally isolated. The first implementation uses HTML/CSS plus a local Chrome-compatible browser, but the parser and theme layer do not depend on Playwright directly.

## Development

```bash
npm run check
npm run lint
npm run test
npm run build
```
