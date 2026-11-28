import assert from 'node:assert/strict';
import test from 'node:test';
import { unstable_dev } from 'wrangler';

// Exercise the public routes of the built Worker, including Astro middleware.
test('both homepage URLs serve the same release layout with their own language and content', async t => {
  const worker = await unstable_dev('dist/_worker.js/index.js', {
    config: 'wrangler.json', ip: '127.0.0.1', port: 0, local: true, persist: false,
    logLevel: 'error', experimental: { disableExperimentalWarning: true, watch: false },
  });
  t.after(() => worker.stop());

  for (const [path, language, headline] of [['/', 'zh-CN', '留给发现。'], ['/en', 'en', 'for discovery.']]) {
    const response = await worker.fetch(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-language'), language);
    const html = await response.text();
    assert.ok(html.includes('<html lang="' + language + '">'));
    assert.ok(html.includes('rel="canonical" href="https://bioseeki.com' + path + '"'));
    assert.ok(html.includes('src="/bioseeki/home-field.js"'));
    assert.doesNotMatch(html, /\/hero-loop-(?:light|dark)/);
    const [, json] = html.match(/id="__NUXT_DATA__"[^>]*>(.*?)<\/script>/s);
    const values = JSON.parse(json);
    const root = values[values[0][1]];
    const cache = values[values[root.data][1]];
    const page = values[values[cache['content:' + path]].page];
    assert.equal(values[root.path], path);
    assert.equal(values[page.href], path);
    assert.ok(values.includes(headline));
  }
  const alias = await worker.fetch('/?lang=en&ref=paper', { redirect: 'manual' });
  assert.equal(alias.status, 302);
  assert.equal(new URL(alias.headers.get('location'), 'https://bioseeki.com').pathname, '/en');
  assert.match(alias.headers.get('location'), /ref=paper/);
});
