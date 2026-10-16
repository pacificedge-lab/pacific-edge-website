# Pacific Edge Website

Coastal Editorial website draft for thepacificedge.ca. Astro, TypeScript, Markdown collections, self-hosted fonts and static output for Cloudflare Workers Static Assets.

## Development and review

Run npm ci, then npm run dev. Development includes clearly labelled review content.

Run npm run build for production output, followed by npm run preview. To review the full draft in a static build, set SITE_REVIEW=true before building. The review includes noindex metadata; it still needs local or private hosting. See docs/coastal-editorial-review.md for outstanding content and acceptance.

## Content

- src/content/pages contains the main page copy.
- work, labs, ideas, partners and people retain their publication schemas.
- Production renders only published collection entries; review shows non-archived entries. Internal work never renders.
- Partners additionally require publish: true. Speculative earlier portfolio entries are archived and remain available in source.

## Contact and launch

The form requires PUBLIC_CONTACT_EMAIL, an HTTPS PUBLIC_CONTACT_ENDPOINT and PUBLIC_PRIVACY_URL. Until configured, the review is visibly non-submitting; production has no inactive form. Copy .env.example to .env for local configuration.

Run npm run release:check against a completed production build with the same environment used at build time. SITE_CONTENT_APPROVED=true records that the content checklist has been completed. The check intentionally fails until contact and content requirements are fulfilled. Verify the actual enquiry service before launch.

No website deployment, DNS change or merge into main is implied by this draft.
