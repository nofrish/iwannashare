import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import os from 'node:os';
import { chromium } from 'playwright-core';
import type { BrowserCheck, Theme } from '../types.js';
import { toFileUrl } from '../utils/fs.js';

const macCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'
];

const linuxCandidates = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge'
];

const windowsCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

export async function findBrowserExecutable(override?: string): Promise<string | undefined> {
  if (override) {
    return (await isExecutable(override)) ? override : undefined;
  }

  const candidates = getCandidates();
  for (const candidate of candidates) {
    if (await isExecutable(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

export async function checkBrowser(override?: string): Promise<BrowserCheck> {
  const executablePath = await findBrowserExecutable(override);
  if (!executablePath) {
    return {
      ok: false,
      message:
        'No Chrome-compatible browser found. Install Google Chrome or pass --browser /path/to/chrome.'
    };
  }

  return {
    ok: true,
    executablePath,
    message: `Found browser: ${executablePath}`
  };
}

export async function screenshotHtml(input: {
  htmlPath: string;
  outputPath: string;
  theme: Theme;
  browserPath?: string;
}): Promise<void> {
  const executablePath = await findBrowserExecutable(input.browserPath);
  if (!executablePath) {
    throw new Error(
      'No Chrome-compatible browser found. Install Google Chrome or pass --browser /path/to/chrome.'
    );
  }

  const browser = await chromium.launch({
    executablePath,
    headless: true
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: input.theme.width,
        height: input.theme.viewportHeight
      },
      deviceScaleFactor: 1
    });

    await page.goto(toFileUrl(input.htmlPath), { waitUntil: 'networkidle' });
    await page.screenshot({
      path: input.outputPath,
      fullPage: true,
      type: 'png'
    });
  } finally {
    await browser.close();
  }
}

function getCandidates(): string[] {
  const platform = os.platform();
  if (platform === 'darwin') {
    return macCandidates;
  }

  if (platform === 'win32') {
    return windowsCandidates;
  }

  return linuxCandidates;
}

async function isExecutable(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
