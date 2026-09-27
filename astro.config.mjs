// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import briefingHome from "./src/integrations/briefing-home.mjs";
import briefingFallback from "./src/integrations/briefing-fallback.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://bioseeki.com",
	integrations: [
		mdx(),
		sitemap({
			// Internal rewrite targets (index.astro serves them at "/") must not be indexed as pages of their own.
			filter: (page) => !/\/(aiseeki-home|bioseeki-home)\/?$/.test(page),
			serialize(item) {
				const path = new URL(item.url).pathname.replace(/\/$/, "") || "/";
				const alternates = [
					{ url: "https://bioseeki.com/", lang: "zh-CN" },
					{ url: "https://bioseeki.com/en", lang: "en" },
				];
				// Match the canonical URLs the pages declare (no trailing slash except the root).
				item.url = path === "/" ? "https://bioseeki.com/" : `https://bioseeki.com${path}`;
				if (path === "/" || path === "/en") return { ...item, changefreq: "weekly", priority: path === "/" ? 1.0 : 0.9, links: alternates };
				if (path === "/briefing") return { ...item, changefreq: "daily", priority: 0.7, lastmod: new Date().toISOString() };
				return { ...item, changefreq: "yearly", priority: 0.3 };
			},
		}),
		briefingHome(),
		briefingFallback(),
	],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
