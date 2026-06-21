import type { Heading, Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { ShareDocument, ShareDocumentMeta } from '../types.js';
import { stripHtml } from '../utils/html.js';
import { parseFrontmatter } from './frontmatter.js';

const processor = unified().use(remarkParse).use(remarkGfm);

export function parseMarkdown(markdown: string): ShareDocument {
  const parsed = parseFrontmatter(markdown);
  const meta = normalizeMeta(parsed.data);
  const tree = processor.parse(parsed.content);
  const transformed = transformCallouts(removeDuplicateTitleHeading(tree, meta.title));
  const hast = toHast(transformed, { allowDangerousHtml: false });
  const html = toHtml(hast, {
    allowDangerousHtml: false,
    closeSelfClosing: true
  });

  return {
    meta,
    html,
    plainText: stripHtml(html)
  };
}

function normalizeMeta(data: Record<string, unknown>): ShareDocumentMeta {
  const meta: ShareDocumentMeta = {};
  assignString(meta, 'title', data.title);
  assignString(meta, 'author', data.author);
  assignString(meta, 'source', data.source);
  assignString(meta, 'date', data.date);
  assignString(meta, 'slug', data.slug);
  return meta;
}

function asString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

function assignString<T extends keyof ShareDocumentMeta>(
  meta: ShareDocumentMeta,
  key: T,
  value: unknown
): void {
  const stringValue = asString(value);
  if (stringValue !== undefined) {
    meta[key] = stringValue;
  }
}

function transformCallouts(tree: Root): Root {
  visit(tree, 'blockquote', (node) => {
    const first = node.children[0];
    if (first?.type !== 'paragraph') {
      return;
    }

    const marker = first.children[0];
    if (marker?.type !== 'text') {
      return;
    }

    const match = marker.value.match(/^\[!(KEY|NOTE|WARNING|QUOTE|TIP)\]\s*/i);
    if (!match) {
      return;
    }

    const kind = match[1]?.toLowerCase() ?? 'note';
    marker.value = marker.value.slice(match[0].length);

    node.data = {
      ...node.data,
      hName: 'aside',
      hProperties: {
        className: [`callout`, `callout-${kind}`],
        'data-callout': kind
      }
    };
  });

  return tree;
}

function removeDuplicateTitleHeading(tree: Root, title: string | undefined): Root {
  if (!title) {
    return tree;
  }

  const firstMeaningfulIndex = tree.children.findIndex((child) => child.type !== 'break');
  if (firstMeaningfulIndex === -1) {
    return tree;
  }

  const first = tree.children[firstMeaningfulIndex];
  if (first?.type !== 'heading' || first.depth !== 1) {
    return tree;
  }

  if (normalizeTitleText(headingText(first)) !== normalizeTitleText(title)) {
    return tree;
  }

  tree.children.splice(firstMeaningfulIndex, 1);
  return tree;
}

function headingText(node: Heading): string {
  return node.children
    .map((child) => {
      if ('value' in child && typeof child.value === 'string') {
        return child.value;
      }

      if ('children' in child && Array.isArray(child.children)) {
        return child.children
          .map((grandchild) =>
            'value' in grandchild && typeof grandchild.value === 'string' ? grandchild.value : ''
          )
          .join('');
      }

      return '';
    })
    .join('');
}

function normalizeTitleText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}
