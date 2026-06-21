---
name: iwannashare
description: Turn Markdown, AI answers, summaries, recommendations, checklists, notes, or other text-heavy content into a polished 1080px-wide PNG long image or a static public web share page. Use when the user asks to share an AI conversation/result as an image, make a long image/card, generate a WeChat-friendly share image, copy a rendered text image to the clipboard, preview a shareable Markdown image, publish a Markdown share page, or get a public link for AI/chat/reading-note content.
---

# IWannaShare

Use IWannaShare to render text-heavy Markdown into a polished long PNG image or publish it as a static web page. It is for readable text shares, not photo generation, charts, diagrams, or non-text visual assets.

## Command

Use the globally installed `iws` command. If it is missing, install IWannaShare from GitHub first:

```bash
npm install -g github:nofrish/iwannashare
iws doctor
```

Render from stdin:

```bash
iws --copy <<'MD'
---
title: Title
date: YYYY-MM-DD
---

Markdown content.
MD
```

Publish a public web page from stdin when the user asks for a link:

```bash
iws publish --copy-url <<'MD'
---
title: Title
slug: optional-url-slug
---

Markdown content.
MD
```

Useful options:

- `--copy`: copy the rendered PNG image to the macOS clipboard so the user can paste it directly.
- `--open`: open the rendered PNG image after rendering when the user wants to review it.
- `--output <path>`: write to a specific PNG path. If stdin is used and `--output` is omitted, IWannaShare writes to a temp PNG path and prints it.
- `publish --copy-url`: copy the public URL to the macOS clipboard after publishing.
- `publish --open`: open the public URL after publishing.

## Workflow

1. Convert the final content into concise Markdown.
2. Add frontmatter with a short `title`; add `date` as `YYYY-MM-DD` when useful; add `slug` only when publishing and a stable URL slug is obvious.
3. Preserve the user's meaning exactly. Do not invent facts, claims, numbers, sources, or conclusions.
4. Clean filler and improve structure only when it does not change substance.
5. Prefer Chinese when the conversation is Chinese.
6. For image sharing, render through stdin unless the Markdown already exists as a file.
7. Use `--copy` when the user wants direct paste/share behavior.
8. Use `--open` when the user wants to inspect the result immediately.
9. For public links, use `iws publish` instead of PNG rendering.
10. Report the PNG path or public URL. If clipboard copy succeeded, say it is ready to paste.

## Web Publishing

Use `iws publish` only when the user asks for a public URL, webpage, link share, or publishing. It accepts the same Markdown input model as rendering: file path or stdin.

Treat publish output as public. Do not publish private or sensitive Markdown unless the user explicitly asks to do so.

If publish config is missing, tell the user to configure it:

```bash
iws config init --repo-path /path/to/github-pages-repo --base-url https://share.example.com
```

Prefer `--copy-url` for conversational workflows so the user can paste the URL directly. Use `--open` when the user wants to review the published page.

## Markdown Guidance

Use normal Markdown: headings, paragraphs, bold text, ordered/unordered lists, inline code, code blocks, and tables.

Keep headings short and avoid turning every paragraph into a list item. Preserve hierarchy more than density.

Assume the final PNG is mainly read on phones. Avoid wide Markdown tables. If content naturally looks like a table but has more than 2 columns, long cells, or comparison-heavy information, convert it into mobile-friendly lists, grouped sections, or short labeled bullets. Preserve all facts and relationships. Use tables only for compact 2-column key-value data or small datasets that remain readable on a narrow screen.

For web publishing, still prefer mobile-friendly structures. The page is wider on desktop, but many readers will open the link on a phone.

Use callouts sparingly:

```md
> [!KEY]
> The central takeaway.

> [!NOTE]
> Helpful context.

> [!WARNING]
> Caveat or risk.
```

Do not write visible labels like "KEY:" or "NOTE:" in the content; IWannaShare renders callout style visually.
