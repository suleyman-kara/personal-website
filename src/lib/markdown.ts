// Markdown -> HTML at build time. GFM via marked, code highlighting via Shiki with a
// light and a dark theme emitted as CSS variables (switched in src/prose.css).
import { Marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

const LANGS = [
  'bash', 'shell', 'c', 'cpp', 'css', 'diff', 'html', 'javascript', 'jsx', 'json',
  'markdown', 'python', 'rust', 'sql', 'toml', 'tsx', 'typescript', 'yaml',
];
const THEMES = { light: 'github-light', dark: 'github-dark' } as const;

let highlighter: Promise<Highlighter> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: Object.values(THEMES), langs: LANGS }));

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TR_MAP: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u' };
export function slugify(text: string): string {
  return text
    .replace(/[çğıİöşü]/gi, (c) => TR_MAP[c] ?? TR_MAP[c.toLowerCase()] ?? c)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function renderMarkdown(md: string): Promise<string> {
  const hl = await getHighlighter();
  const loaded = new Set(hl.getLoadedLanguages());
  const seen = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(inner) || 'section';
        const n = seen.get(id) ?? 0;
        seen.set(id, n + 1);
        if (n) id = `${id}-${n}`;
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        const name = (lang ?? '').trim().split(/\s+/)[0].toLowerCase();
        const alias: Record<string, string> = { js: 'javascript', ts: 'typescript', sh: 'bash', py: 'python', md: 'markdown', yml: 'yaml', 'c++': 'cpp' };
        const resolved = alias[name] ?? name;
        return hl.codeToHtml(text.replace(/\n$/, ''), {
          lang: loaded.has(resolved) ? resolved : 'text',
          themes: THEMES,
          defaultColor: false,
        });
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith('https://suleymankara.com');
        const attrs = [
          `href="${escapeHtml(href)}"`,
          title ? `title="${escapeHtml(title)}"` : '',
          external ? 'target="_blank" rel="noreferrer"' : '',
        ].filter(Boolean);
        return `<a ${attrs.join(' ')}>${inner}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${t} loading="lazy" decoding="async" />`;
      },
    },
    hooks: {
      // Wide tables scroll inside their own box instead of widening the page.
      postprocess: (html: string) =>
        html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>'),
    },
  });
  return marked.parse(md) as Promise<string> | string;
}
