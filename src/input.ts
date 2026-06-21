import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface MarkdownInput {
  markdown: string;
  label: string;
  sourcePath?: string;
}

export async function readMarkdownInput(input: string | undefined): Promise<MarkdownInput> {
  if (input === undefined || input === '-') {
    return {
      markdown: await readStdin(),
      label: '<stdin>'
    };
  }

  const sourcePath = path.resolve(input);
  return {
    markdown: await readFile(sourcePath, 'utf8'),
    label: sourcePath,
    sourcePath
  };
}

export async function readStdin(): Promise<string> {
  process.stdin.setEncoding('utf8');

  let content = '';
  for await (const chunk of process.stdin) {
    content += chunk;
  }

  if (!content.trim()) {
    throw new Error('No Markdown input received from stdin.');
  }

  return content;
}
