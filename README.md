# Pacific Edge Website

Pacific Edge's Coastal Editorial website at https://thepacificedge.ca. Astro, TypeScript, Markdown collections, self-hosted fonts and static output for Cloudflare Workers Static Assets.

PR #5 was merged and deployed on 22 October 2026. Chris confirmed production contact delivery and Reply-To after configuring the Turnstile runtime secret. See docs/contact-setup.md for the acceptance record and remaining www redirect setup.

## Development and review

Run npm ci, then npm run dev. Development includes clearly labelled review content.

Run npm run build for production output, followed by npm run preview. Run npm run build:review for the full draft: it explicitly enables review mode, disables contact submission and validates the generated output before deployment. The review includes noindex metadata; it still needs local or private hosting. See docs/coastal-editorial-review.md for outstanding content and acceptance.

## Content

- src/content/pages contains the main page copy.
- work, labs, ideas, partners and people retain their publication schemas.
- Production renders only published collection entries; review shows non-archived entries. Internal work never renders.
- Partners additionally require publish: true. Speculative earlier portfolio entries are archived and remain available in source.

## Contact and launch

The public mailbox is hello@thepacificedge.ca. A Cloudflare Worker handles /api/contact with Turnstile, rate limiting and restricted email delivery. Production builds and the production Worker enable the form. Ordinary review builds disable submission; the protected contact-test build is an explicit exception. TURNSTILE_SECRET_KEY must be a production runtime secret; a build secret alone is insufficient. See docs/contact-setup.md for configuration and acceptance. Copy .env.example to .env for local build configuration.

Run npm run release:check against a completed production build with the same environment used at build time. SITE_CONTENT_APPROVED=true records that the content checklist has been completed. The check intentionally fails until contact and content requirements are fulfilled. CONTACT_DELIVERY_VERIFIED=true records completion of the hosted acceptance described in docs/contact-setup.md. Verify delivery before enabling the production form.

Pushes to main trigger the connected Cloudflare production build and deployment. wrangler.jsonc retains the apex custom domain. The www-to-apex redirect is a separate Cloudflare zone rule and is not managed by this repository.
