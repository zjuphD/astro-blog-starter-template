// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import briefingHome from "./src/integrations/briefing-home.mjs";
import briefingFallback from "./src/integrations/briefing-fallback.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap(), briefingHome(), briefingFallback()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
