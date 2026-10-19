# Pacific Edge Website

Coastal Editorial website draft for thepacificedge.ca. Astro, TypeScript, Markdown collections, self-hosted fonts and static output for Cloudflare Workers Static Assets.

## Development and review

Run npm ci, then npm run dev. Development includes clearly labelled review content.

Run npm run build for production output, followed by npm run preview. Run npm run build:review for the full draft: it explicitly enables review mode, disables contact submission and validates the generated output before deployment. The review includes noindex metadata; it still needs local or private hosting. See docs/coastal-editorial-review.md for outstanding content and acceptance.

## Content

- src/content/pages contains the main page copy.
- work, labs, ideas, partners and people retain their publication schemas.
- Production renders only published collection entries; review shows non-archived entries. Internal work never renders.
- Partners additionally require publish: true. Speculative earlier portfolio entries are archived and remain available in source.

## Contact and launch

The confirmed public mailbox is hello@thepacificedge.ca. A Cloudflare Worker handles /api/contact with Turnstile, rate limiting and restricted email delivery. Both build-time and runtime switches default to disabled. Review builds always remain non-submitting; production offers direct email until the form is activated. See docs/contact-setup.md for account configuration, local checks and hosted acceptance. Copy .env.example to .env for local build configuration.

Run npm run release:check against a completed production build with the same environment used at build time. SITE_CONTENT_APPROVED=true records that the content checklist has been completed. The check intentionally fails until contact and content requirements are fulfilled. CONTACT_DELIVERY_VERIFIED=true records completion of the hosted acceptance described in docs/contact-setup.md. Verify delivery before enabling the production form.

No website deployment, DNS change or merge into main is implied by this draft.
