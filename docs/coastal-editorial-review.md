# Coastal Editorial implementation review

Approved by Chris McLean on 15 October 2026. Implements Website Brief revision 0.6 and Copy Draft 0.3. This branch is a review draft; it is not a launch approval.

## Repository review and retained foundation

- Keep Astro, static output, TypeScript, local fonts, Markdown collections and Cloudflare Workers Static Assets as the deployment target.
- Replace the earlier four capability areas with Strategy and direction, Operations and capability, and Advisory and leadership.
- Add dedicated AI and First Nations routes, retain Labs, and add a substantive founder introduction.
- Use the approved coastal composition and palette. Self-host Inter and Source Serif 4 to carry the sans-serif body and editorial headings into production.
- Preserve the wider draft portfolio in source as archived entries. Earlier work summaries lacked substantive case accounts and must not imply verified delivery evidence.
- Keep named partners behind their status and explicit publication flag. Internal work is excluded even in review mode.
- The assets are supplied brand atmosphere and a supplied founder portrait. They do not represent client sites, assignments or partners.

## Review modes

Development shows review content. For a production-style review build, set SITE_REVIEW=true before npm run build. It adds a draft banner, noindex metadata, an empty sitemap, the ISEF review entry and explicitly labelled work placeholders. Noindex is not access control: keep the review build local or behind real private access.

A default production build excludes unpublished collection items and the work placeholders. Unconfirmed partner links are omitted. Contact inputs are disabled in review; public output omits the form until a verified email, HTTPS endpoint and privacy URL are configured.

## Content needed from Chris

- Two verified work accounts: one strategic judgment or initiative recovery example, one operational or technology delivery example. Record the situation, constraints, role, decisions, work, result and current delivery status. Confirm naming and confidentiality.
- Confirm partner names, expertise, working arrangements and agreed public descriptions. The site is designed to remain complete while these are pending.
- Review the founder biography and provide a short personal perspective if desired.
- Confirm the scope and delivery capacity behind the initial engagements, including funding pathways and specialist implementation.
- Confirm ISEF Support's public name, summary and availability before publishing its entry. Its current review stage is Preparing for launch.
- Confirm the public email, actual enquiry handler and privacy information.

## Final acceptance before launch

- Review the site as a referred executive, First Nations administrator and prospective AI client. Each should find a relevant offer, credibility and next step. Check recovery and fractional leadership routes too.
- Review the two work accounts and product maturity against current evidence.
- Confirm contact receipt, validation, failure behavior, privacy and any spam controls against the actual configured service.
- Verify keyboard navigation, visible focus, mobile menu, link targets, 320px layouts and image crops.
- Build with review disabled, run release:check, confirm canonical thepacificedge.ca URLs and inspect production publication states.
- Configure the domain and redirects in Cloudflare and perform final deployment acceptance. No deployment or DNS changes are included in this branch.

## Implementation validation — 15 October 2026

- Astro check: 32 source files, zero errors, warnings or hints.
- Production build and output check: 12 HTML files and 323 local references; unpublished product entries, archived portfolio entries, unconfirmed partner links and case placeholders excluded.
- Review build and output check: 16 HTML files and 467 local references; deliberate review content and noindex metadata present.
- Browser review: 10 routes at 1440, 736, 390 and 320 pixels. No horizontal overflow, clipping outside the page, broken images, failed requests or JavaScript exceptions in these checks.
- Mobile navigation: opens, navigates, and closes with Escape while returning focus to its summary control.
- Contact preview: four disabled fields, disabled submit action, no form action URL, and a visible non-submission explanation. No live enquiry was sent.
- Release check intentionally reports the missing contact configuration and outstanding content approval. The draft is not ready for public launch.
- Expected build notices: the partners collection is empty until real profiles are supplied. No fabricated seed profiles were added to silence these notices.
- A dependency lockfile records the tested install. Vite's preserveSymlinks option resolves the dependency-loading failure observed in the Windows sandbox checkout.
