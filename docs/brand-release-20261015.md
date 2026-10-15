# BioSeeki brand release — 2026-10-15

The approved Chinese landing page is packaged in `public/bioseeki-release/`. It is served at the BioSeeki root by `src/middleware.ts`. The existing English homepage, briefing routes, legal pages and Aiseeki host routing are retained. Public root asset paths are mapped to this bundle. The internal design-reference server and original comparison HTML are not deployed.

The bundle contains four research scenes, the personal-agent section, pricing, FAQ, the site's own brand assets and the approved scroll/water/glass presentation. All installation/account/legal links use production routes. `/download` preserves the current email-based Mac Beta distribution; this release does not publish a new installer.

`bioseeki-base.js` owns the BioSeeki navigation, account destinations and presentation adapter; `bioseeki-base.css` owns the brand typography and layout overrides. The landing payload is in `index.html`. Compiled rendering dependencies live under `_nuxt/`. Keep these files together when updating a release. The page uses only local rendering assets and the official BioSeeki account origin; inherited third-party forms cannot submit.

Search-console verification tags and the existing shared Cloudflare Worker remain in use. The build and TypeScript checks pass. Real email delivery, new account creation, desktop credential delivery and financial settlement were not exercised as part of the visual release.

The account UI is deployed separately on api.bioseeki.com. Its existing account script is retained; the payment service changes only its HTML template. The prior server files are backed up at `/var/backups/bioseeki-brand-20261015-144933`. The prior Cloudflare deployment version is `bd4843b9-e5ec-41b7-9ae4-39867d9288e3`. Roll back these layers independently if needed.
