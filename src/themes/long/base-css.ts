export const longBaseCss = String.raw`
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-width: var(--iws-width);
  background: var(--iws-body-bg);
  color: var(--iws-text);
}

body {
  font-family: var(--iws-body-font);
  font-weight: var(--iws-body-weight);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.page {
  width: var(--iws-width);
  min-height: 800px;
  padding: var(--iws-page-padding);
  background: var(--iws-page-background);
}

.kicker,
.title-area,
.content,
.footer {
  width: min(100%, var(--iws-content-max-width));
  margin-left: auto;
  margin-right: auto;
}

.kicker {
  margin-top: 0;
  margin-bottom: 24px;
  color: var(--iws-muted);
  font-family: var(--iws-sans);
  font-size: 21px;
  font-weight: 520;
  line-height: 1.2;
  letter-spacing: 0;
  text-align: right;
}

.title-area {
  margin-top: 0;
  margin-bottom: var(--iws-title-area-margin);
  padding-bottom: 26px;
  border-bottom: 3px solid var(--iws-accent);
}

h1 {
  margin: 0;
  max-width: var(--iws-title-max-width);
  color: var(--iws-title);
  font-family: var(--iws-title-font);
  font-size: var(--iws-title-size);
  font-weight: var(--iws-title-weight);
  line-height: var(--iws-title-line-height);
  letter-spacing: 0;
}

.content {
  max-width: var(--iws-content-max-width);
}

.content > *:first-child {
  margin-top: 0;
}

p {
  margin: 0 0 var(--iws-body-paragraph-margin);
  color: var(--iws-text);
  font-size: var(--iws-body-size);
  font-weight: var(--iws-body-weight);
  line-height: var(--iws-body-line-height);
  -webkit-text-stroke: var(--iws-body-text-stroke);
}

.has-dropcap .content > p:first-of-type::first-letter {
  float: left;
  padding: 13px 13px 0 0;
  color: var(--iws-accent);
  font-size: 88px;
  font-weight: 750;
  line-height: 0.86;
}

strong {
  color: var(--iws-strong);
  font-weight: 800;
}

em {
  color: var(--iws-strong);
}

h2 {
  margin: 64px 0 28px;
  color: var(--iws-accent);
  font-family: var(--iws-heading-font);
  font-size: var(--iws-heading-size);
  font-weight: 760;
  line-height: 1.28;
  letter-spacing: 0;
}

h3 {
  margin: 48px 0 22px;
  color: var(--iws-strong);
  font-family: var(--iws-heading-font);
  font-size: var(--iws-h3-size);
  font-weight: 730;
  line-height: 1.32;
  letter-spacing: 0;
}

ul,
ol {
  margin: 0 0 32px;
  padding-left: 42px;
  color: var(--iws-text);
  font-family: var(--iws-body-font);
  font-size: var(--iws-list-size);
  font-weight: var(--iws-body-weight);
  line-height: var(--iws-list-line-height);
  -webkit-text-stroke: var(--iws-body-text-stroke);
}

li {
  margin: 10px 0;
  padding-left: 10px;
}

blockquote,
.callout {
  margin: 36px 0;
  padding: 8px 0 8px 34px;
  border-left: 6px solid var(--iws-accent);
}

blockquote p,
.callout p {
  margin: 0 0 18px;
  color: var(--iws-callout-text);
  font-size: var(--iws-callout-size);
  font-weight: var(--iws-body-weight);
  line-height: var(--iws-body-line-height);
  -webkit-text-stroke: var(--iws-body-text-stroke);
}

blockquote p:last-child,
.callout p:last-child {
  margin-bottom: 0;
}

.callout {
  margin-left: 0;
}

code {
  padding: 0.12em 0.32em;
  border-radius: 8px;
  background: var(--iws-code-bg);
  color: var(--iws-code-text);
  font-family: var(--iws-mono);
  font-size: 0.88em;
}

pre {
  margin: 34px 0;
  padding: 30px 34px;
  overflow: hidden;
  border: 1px solid var(--iws-accent-line);
  background: var(--iws-pre-bg);
  color: var(--iws-code-text);
}

pre code {
  padding: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1.7;
}

hr {
  margin: 48px 0;
  border: 0;
  border-top: 2px solid var(--iws-accent-line);
}

table {
  width: 100%;
  margin: 36px 0;
  border-collapse: collapse;
  font-family: var(--iws-sans);
  font-size: 23px;
  line-height: 1.6;
}

th,
td {
  padding: 16px 18px;
  border-bottom: 1px solid var(--iws-accent-line);
  text-align: left;
  vertical-align: top;
}

th {
  color: var(--iws-strong);
  font-weight: 760;
}

.footer {
  margin-top: var(--iws-footer-margin-top);
  padding-top: 26px;
  border-top: 2px solid color-mix(in srgb, var(--iws-accent) 46%, transparent);
  color: var(--iws-muted);
  font-family: var(--iws-sans);
  font-size: 24px;
  font-weight: 520;
  line-height: 1.35;
  text-align: center;
}

.title-newspaper h1 {
  padding-top: 22px;
  border-top: 8px double var(--iws-accent);
  padding-bottom: 22px;
  border-bottom: 8px double var(--iws-accent);
}

.title-newspaper .title-area {
  padding-bottom: 0;
  border-bottom: 0;
}

.title-compact h1 {
  max-width: 720px;
}

.callout-left-bar {
  padding: 32px 48px 34px 38px;
  border: 1px solid var(--iws-callout-border);
  border-left: 10px solid var(--iws-accent);
  border-radius: 22px;
  background: var(--iws-callout-bg);
  box-shadow: 0 20px 62px -48px var(--iws-shadow), 0 0 42px -32px var(--iws-shadow);
}

.callout-soft-card {
  padding: 34px 54px 36px 44px;
  border: 1px solid var(--iws-callout-border);
  border-radius: 22px;
  background: var(--iws-callout-bg);
  box-shadow: 0 20px 64px -48px var(--iws-shadow), 0 0 46px -32px var(--iws-shadow);
}

.callout-quote-card {
  position: relative;
  padding: 36px 54px 36px 86px;
  border: 1px solid var(--iws-callout-border);
  border-radius: 22px;
  background: var(--iws-callout-bg);
  box-shadow: 0 20px 64px -50px var(--iws-shadow), 0 0 44px -34px var(--iws-shadow);
}

.callout-quote-card::after {
  content: "“";
  position: absolute;
  left: 18px;
  top: 8px;
  color: var(--iws-accent);
  font-family: var(--iws-serif);
  font-size: 86px;
  line-height: 1;
}

.callout-plain-rule {
  padding: 22px 0 22px 32px;
  border: 0;
  border-left: 5px solid var(--iws-accent);
  background: transparent;
}

.callout-key {
  background: var(--iws-callout-key-bg);
}

.callout-note {
  background: var(--iws-callout-note-bg);
}

.callout-warning {
  background: var(--iws-callout-warning-bg);
}
`;
