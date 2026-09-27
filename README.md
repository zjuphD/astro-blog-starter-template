# BioSeeki & Aiseeki websites

Source of **[bioseeki.com](https://bioseeki.com)** — BioSeeki, an AI research workspace for individual scientists (deep research, data analysis, writing, figures and GeneCode molecular cloning, with citations that trace back to the source) — and **[aiseeki.com](https://aiseeki.com)**. Both domains are served by one Astro app on Cloudflare Workers.

- BioSeeki homepage: [中文](https://bioseeki.com/) · [English](https://bioseeki.com/en)
- AI for Science daily briefing: [bioseeki.com/briefing](https://bioseeki.com/briefing)
- GeneCode web workspace: [genecode-agent.pages.dev](https://genecode-agent.pages.dev) · [source](https://github.com/zjuphD/GeneCode)

## Layout

| Path | What it is |
| --- | --- |
| `src/pages/index.astro` | Routes by host: aiseeki.com → `aiseeki-home.astro`, everything else → `bioseeki-home.astro` |
| `src/components/bioseeki/Home.astro` | BioSeeki homepage template (no copy of its own) |
| `src/i18n/bioseeki.ts` | All BioSeeki homepage copy, 中文 + English; language detection for `/` |
| `src/pages/en.astro` | Fixed English homepage |
| `src/pages/briefing.astro` + `src/data/briefings.json` | Daily briefing; the brand follows the requesting domain |
| `src/pages/robots.txt.ts`, `public/llms.txt`, `src/seo.ts` | Crawler rules, summary for LLM-based engines, search-console verification tokens |
| `.github/workflows/` | Daily briefing bot, source-cover capture, site check, IndexNow pings |

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into ./dist
```

Pushes to `main` deploy through Cloudflare Workers Builds; pull requests get a preview URL.
