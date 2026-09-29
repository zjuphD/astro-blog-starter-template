// Copy strings carry plain-text glyphs (↗ ↓ ↑ → ✉ ✓ ✗ ⤢ ●) so they stay readable anywhere the copy is reused
// (meta tags, JSON-LD, plain-text mail). On the page they are drawn from the SVG sprite in Home.astro instead,
// so every arrow and mark has the same weight, size and baseline in any font.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = (id: string, cls: string) => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const TRAILING: Record<string, string> = { "↗": "a-ext", "↓": "a-down", "↑": "a-up", "✉": "a-mail" };
const LEADING: Record<string, string> = { "✓": "g-check", "✗": "g-x", "⤢": "i-expand" };

/** `html: true` leaves markup in `raw` alone (for strings that already contain <a>); `verdict` also maps a leading ! or ?. */
export function glyphHtml(raw: string, opts: { html?: boolean; verdict?: boolean } = {}): string {
  let s = opts.html ? raw : esc(raw);
  if (opts.verdict) s = s.replace(/^!\s/, `${svg("g-alert", "gi")}`).replace(/^\?\s/, `${svg("g-q", "gi")}`);
  s = s.replace(/\s*([↗↓↑✉])/g, (_, g) => svg(TRAILING[g], "ai"));
  s = s.replace(/\s*→\s*/g, () => svg("a-right", "ai ai-mid"));
  s = s.replace(/([✓✗⤢])\s?/g, (_, g) => svg(LEADING[g], "gi"));
  s = s.replace(/●\s?/g, '<i class="dot-i" aria-hidden="true"></i>');
  return s;
}
