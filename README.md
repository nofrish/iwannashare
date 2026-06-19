# IWannaShare

Turn Markdown and AI responses into a polished 1080px long image for mobile sharing.

IWannaShare is a local-first CLI:

```text
Markdown -> HTML/CSS layout -> local Chrome screenshot -> PNG
```

The first release intentionally ships one theme: `default`. It is optimized for Chinese mobile reading and WeChat-style sharing.

## Quick Start

Clone the repo and install both the CLI and the Codex Skill:

```bash
git clone https://github.com/nofrish/iwannashare.git
cd iwannashare
./scripts/install.sh
```

The installer:

- installs the `iws` / `iwannashare` CLI globally through npm
- copies `skills/iwannashare` to `${CODEX_HOME:-$HOME/.codex}/skills/iwannashare`

Set `CODEX_HOME` before running the installer if your Codex skills live somewhere else.

Restart Codex after installing the skill.

Check the CLI:

```bash
iws doctor
```

Render Markdown from stdin:

```bash
iws --copy --open <<'MD'
---
title: My Share Note
date: 2026-06-20
---

This is the content to share.
MD
```

Render a Markdown file:

```bash
iws ./my-note.md --output ./share.png --copy --open
```

## Codex Skill

This repo includes a Codex Skill at `skills/iwannashare`.

The recommended installer above installs it locally. If you only want to install the Skill through Codex's skill installer, ask Codex to install:

```text
https://github.com/nofrish/iwannashare/tree/main/skills/iwannashare
```

The Skill assumes the `iws` command is available. Install the CLI separately when using this Skill-only path:

```bash
npm install -g github:nofrish/iwannashare
```

## Development

Local development:

```bash
npm install
npm run doctor
npm run render:example
```

The example output is written to:

```text
examples/output/default.png
```

Render your own Markdown during development:

```bash
npm run dev -- ./my-note.md --output ./share.png
```

Render Markdown from stdin:

```bash
cat ./my-note.md | npm run dev -- --output ./share.png
```

For agent workflows during development, a heredoc is often the simplest form:

```bash
npm run dev -- --copy <<'MD'
---
title: My Share Note
date: 2026-06-20
---

This is the content to share.
MD
```

Render and copy the PNG image to the macOS clipboard:

```bash
npm run dev -- ./my-note.md --output ./share.png --copy
```

Render and open the PNG image for review:

```bash
npm run dev -- ./my-note.md --output ./share.png --open
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

If `iws` is not installed, install it with `npm install -g github:nofrish/iwannashare`.

Render from stdin when possible: `iws --output <output-file.png>`. Use a Markdown file path when the content already exists as a file: `iws <markdown-file> --output <output-file.png>`. If the user wants to paste the image directly, add `--copy` to copy the PNG to the macOS clipboard. If the user wants to review the result immediately, add `--open` to open the PNG after rendering. If you are inside the repository, use `npm run dev -- --output <output-file.png>` for stdin or `npm run dev -- <markdown-file> --output <output-file.png>` for file input.

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
- Return the Markdown source path if one was created; otherwise say stdin was used.
- If `--copy` was used successfully, tell the user the image is ready to paste.
- If `--open` was used successfully, tell the user the image has been opened for review.
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

## Quality Checks

```bash
npm run check
npm run lint
npm run test
npm run build
```
