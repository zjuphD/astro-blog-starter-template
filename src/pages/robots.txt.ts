import type { APIRoute } from "astro";

export const prerender = false;

// Host-aware: bioseeki.com and aiseeki.com share this Worker. Search and AI-search
// crawlers are allowed explicitly so a blanket bot rule elsewhere can't shadow them.
// Note: Cloudflare's "Block AI bots" / managed robots.txt settings sit in front of this
// file and can still block these crawlers — check the zone's Bots settings.
const AI_CRAWLERS = [
  "Googlebot", "Bingbot", "Baiduspider", "Sogou web spider", "360Spider", "YandexBot", "DuckDuckBot", "Applebot",
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", "Claude-SearchBot", "Claude-User", "ClaudeBot",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended",
];

export const GET: APIRoute = ({ url }) => {
  const host = url.hostname.toLowerCase();
  const isAiseeki = host === "aiseeki.com" || host === "www.aiseeki.com";
  const origin = isAiseeki ? "https://aiseeki.com" : "https://bioseeki.com";
  const lines = [
    ...AI_CRAWLERS.flatMap((ua) => [`User-agent: ${ua}`, "Allow: /", ""]),
    "User-agent: *",
    "Allow: /",
    // internal rewrite targets; the real pages live at /
    "Disallow: /bioseeki-home",
    "Disallow: /aiseeki-home",
    "",
    ...(isAiseeki ? [] : [`Sitemap: ${origin}/sitemap-index.xml`]),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
};
