import template from '../public/bioseeki-release/index.html?raw';
import { chineseTitle, chineseDescription, chineseKeywords, englishCopy } from './i18n/landing-en';

const homepageSecurityPolicy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.bioseeki.com; media-src 'self' blob:; worker-src 'self' blob:; frame-src 'self'; form-action 'none'; base-uri 'self'";

function translate(value: string) {
  return Object.hasOwn(englishCopy, value) ? englishCopy[value] : value;
}

function englishPayload(json: string) {
  const values = JSON.parse(json);
  // Nuxt stores references as array indexes. Change the page URL without
  // changing the shared "/" value used for Chinese and x-default alternates.
  const root = values[values[0][1]];
  const cache = values[values[root.data][1]];
  const content = values[cache['content:/en']];
  const enPath = values.push('/en') - 1;
  root.path = enPath;
  values[content.page].href = enPath;
  const localized = values.map((value: unknown) => typeof value === 'string' ? translate(value) : value);
  return JSON.stringify(localized).replaceAll('<', '\\u003c');
}

function englishHomepage() {
  // Translate the published content before the renderer starts. Both routes
  // use the exact same sections, styles, interactive components and assets.
  const [head, body] = template.split('</head>');
  let localizedHead = head
    .replace('<html lang="zh-CN">', '<html lang="en">')
    .replace('rel="canonical" href="https://bioseeki.com/"', 'rel="canonical" href="https://bioseeki.com/en"')
    .replace('property="og:url" content="https://bioseeki.com/"', 'property="og:url" content="https://bioseeki.com/en"');
  for (const text of [chineseTitle, chineseDescription, chineseKeywords]) {
    localizedHead = localizedHead.replaceAll(text, translate(text));
  }
  const localizedBody = body.replace(
    /(<script\b[^>]*\bid="__NUXT_DATA__"[^>]*>)([\s\S]*?)(<\/script>)/,
    (_, start: string, json: string, end: string) => start + englishPayload(json) + end,
  );
  return localizedHead + '</head>' + localizedBody;
}

type HomeLanguage = 'zh-CN' | 'en';
const documents: Partial<Record<HomeLanguage, string>> = {};

function renderHomepage(language: HomeLanguage) {
  const en = language === 'en';
  const html = en ? englishHomepage() : template;
  const label = (value: string) => en ? translate(value) : value;
  // The interactive release mounts into an empty root. Keep an introduction,
  // installer and language switch usable even when scripts are unavailable.
  const introduction = `<noscript><main class="bio-home-static">
    <img src="/product-assets/bioseeki-logo.svg" alt="BioSeeki" width="146" height="35">
    <h1>${label('把时间，')}${en ? ' ' : ''}${label('留给发现。')}</h1>
    <p>${label(chineseDescription)}</p>
    <a href="${en ? '/download?lang=en' : '/download'}">${label('下载 BioSeeki')}</a>
    <a href="${en ? '/' : '/en'}" hreflang="${en ? 'zh-CN' : 'en'}" lang="${en ? 'zh-CN' : 'en'}">${en ? '中文' : 'EN'}</a>
  </main></noscript>`;
  return html.replace('<body>', '<body>' + introduction);
}

export function homepageResponse(language: HomeLanguage, method: string) {
  const html = documents[language] ??= renderHomepage(language);
  return new Response(method === 'HEAD' ? null : html, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Language': language,
    'Cache-Control': 'no-cache, must-revalidate',
    'Content-Security-Policy': homepageSecurityPolicy,
  } });
}
