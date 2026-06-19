export interface FrontmatterResult {
  data: Record<string, string>;
  content: string;
}

export function parseFrontmatter(markdown: string): FrontmatterResult {
  if (!markdown.startsWith('---\n') && !markdown.startsWith('---\r\n')) {
    return {
      data: {},
      content: markdown
    };
  }

  const newline = markdown.startsWith('---\r\n') ? '\r\n' : '\n';
  const closing = `${newline}---${newline}`;
  const closingIndex = markdown.indexOf(closing, 3);

  if (closingIndex === -1) {
    return {
      data: {},
      content: markdown
    };
  }

  const raw = markdown.slice(4, closingIndex);
  const content = markdown.slice(closingIndex + closing.length);

  return {
    data: parseKeyValues(raw),
    content
  };
}

function parseKeyValues(raw: string): Record<string, string> {
  const data: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf(':');
    if (separator <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key) {
      data[key] = unquote(value);
    }
  }

  return data;
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
