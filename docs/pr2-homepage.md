# PR2 — Homepage visual system and content integration

The homepage now uses an atmospheric coastal hero, typography-led approach section, asymmetric selected Work, four ruled capability areas, dark Labs index, editorial Ideas shelf and a spacious closing invitation. Mobile uses its own headline wrapping, image crop and numbered approach rows.

## Content behaviour

- Work, Labs and Ideas still come from Markdown collections; no status was promoted.
- Each collection is capped at three featured entries and ordered by frontmatter.
- Empty homepage collections are omitted in production, including the hero's selected-work anchor when there is no visible work.
- Partners require `status: published`, `publish: true` and `featured: true`, even in development. Navigation stays dormant.
- The AI Work summary explicitly describes a body of work.
- The operational evidence figure is a conceptual diagram, not a product screenshot or client artifact. It is tied to the operational-evidence story.
- The contact endpoint remains unconfigured and fail-safe.

## Image provenance

The built-in image-generation tool produced an original fictional coastal landscape. It does not document a specific place or engagement. Decorative empty alternative text avoids implying factual evidence. The optimized files are `public/images/pacific-coast.webp` (1536 × 1024) and `public/images/pacific-coast-768.webp` (768 × 512). Responsive selection, intrinsic dimensions and high fetch priority are set in the hero. The desktop derivative is approximately 133 KiB; the mobile derivative is approximately 35 KiB.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: atmospheric website hero for Pacific Edge, a restrained editorial strategy and technology studio. Create a clean standalone wide landscape image, 1536x1024. A remote Pacific Northwest coastal headland with dark evergreen trees emerging from layered sea fog, still dark slate ocean in foreground, far horizon disappearing into overcast pale grey sky. Photographic fine detail, natural grain, muted near-monochrome slate green and charcoal, no saturated teal. Headland enters from right, airy fog and quiet water on left. Quiet authority, architecture journal photography, soft diffuse light, no sunset. No people, buildings, boats, logos, text, interface, or watermarks. This is a fictional atmospheric landscape, not documentation of a specific location.

`node scripts/prepare-coast.mjs <original-image-path>` regenerates the optimized derivatives using the existing Astro image dependency. No runtime dependency was added. The lockfile preserves the dependency resolution from the original local foundation checkout.

## Review

Use `npm.cmd run dev` to review the selected draft stories locally. Use `npm.cmd run build` followed by `node scripts/check-publication.mjs` to check the endpoint-free production baseline. The publication check is intentionally a prelaunch baseline assertion; update its dormant Partner and disabled-contact expectations when those capabilities are explicitly activated in later workstreams.

This change does not deploy the site. Cloudflare preview deployment and the contact endpoint remain PR5 work. Detail-template refinement remains PR3 work.

## Verification results

- Astro diagnostics: no errors or warnings; the foundation's deprecated schema API still produces hints.
- Static production build: eight pages. Empty People/Partners collections produce existing build notices.
- Publication check: all nine draft entries excluded; local links resolve; no client scripts; Partners absent; contact form disabled.
- Browser review: desktop and mobile composition, working mobile navigation to Contact, loaded responsive hero image, and no page overflow at 320, 768, 1024 and 1440 pixels. The conceptual evidence diagram becomes vertical on small screens.
- This is targeted implementation QA, not the full accessibility/performance/SEO launch audit scheduled for PR6.
