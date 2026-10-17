# Coastal Editorial implementation review

Approved design direction from Chris McLean on 15 October 2026. Implements Website Brief revision 0.6 and Copy Draft 0.5. This branch is a review draft; it is not a launch approval.

## Repository review and retained foundation

- Keep Astro, static output, TypeScript, local fonts, Markdown collections and Cloudflare Workers Static Assets as the deployment target.
- Replace the earlier four capability areas with Strategy and direction, Operations and capability, and Advisory and leadership.
- Add dedicated AI and First Nations routes, retain Labs, and add a substantive founder introduction.
- Use the approved coastal composition and palette. Self-host Inter and Source Serif 4 to carry the sans-serif body and editorial headings into production.
- Preserve the wider draft portfolio in source as archived entries. Earlier work summaries lacked substantive case accounts and must not imply verified delivery evidence.
- Keep named partners behind their status and explicit publication flag. Internal work is excluded even in review mode.
- The assets are supplied brand atmosphere and a supplied founder portrait. They do not represent client sites, assignments or partners.

## Review modes

Development shows review content. For a production-style review build, set SITE_REVIEW=true before npm run build. It adds a draft banner, noindex metadata, an empty sitemap, the ISEF review entry and the two anonymized case accounts. Noindex is not access control: keep the review build local or behind real private access.

A default production build excludes unpublished collection items and the work placeholders. Unconfirmed partner links are omitted. Contact inputs are disabled in review; public output omits the form until a verified email, HTTPS endpoint and privacy URL are configured.

## Content needed from Chris

- Two substantive case accounts are integrated: fibre delivery operating-model design and reporting recovery within an urgent workforce implementation. Chris approved the editorial direction and general client descriptions. Final website wording remains in review status pending publication approval; client and employer names are excluded.
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

## Evidence integration - 15 October 2026

- Home and Selected Work show the two cases, their service relevance, general organization descriptions and attribution to Chris McLean's prior professional experience.
- Advisory includes a concise Experience in practice section linking to both accounts. Each full account links back to its relevant Advisory service or recovery section.
- The fibre account emphasizes framework strategy and integration of distributed partner knowledge across the entire delivery chain. Exact partner count, implementation extent and subsequent company closure remain outside website source.
- The workforce account credits the data team's source-information work separately from Chris's R solution. It claims usable reporting answers and does not claim that the solution fixed allocation rules, eliminated approval workload or constituted an AI implementation.
- Publication status is shared across cards, supporting evidence links and full routes. Review-only accounts remain absent from production output.
- No proprietary artifacts, raw extracts, identifying client details or internal evidence notes are included in these case entries.

### Integration validation

- Astro check: 33 source files, zero diagnostics. Production output: 12 HTML files and 323 local references; review output: 18 HTML files and 537 local references.
- Review checks verify both case routes, links from Home and Advisory, prior-experience attribution and replacement of the homepage placeholders. Production checks verify that the review-only accounts and their homepage links are excluded.
- Browser checks: 12 routes at 1440, 736, 390 and 320 pixels, with no horizontal overflow, clipped content, broken images, failed requests or script exceptions. Mobile navigation and non-submitting contact behavior passed.
- Standalone preview: all 12 pages loaded with imagery. Click navigation passed from Home to the fibre case, back to the relevant Advisory section, into the workforce case and back to Selected Work.

## Buyer review revisions - 17 October 2026

- First Nations services now describe additional capacity and practical business and service design shaped around leadership priorities, existing strengths, governance and requirements. The copy avoids presenting a predetermined model of how an organization should operate.
- Chris confirmed substantial planning engagements with Indigenous groups in the United States and the current Indigenous education systems work. The public account uses those general descriptions, credits Chris and identifies no clients. No engagement outcomes or subject matter beyond the confirmed scope have been added.
- The broader planning experience appears near the beginning of First Nations services and in the founder biography. Indigenous education implementation and ISEF remain distinct, proportionate supporting examples.
- Advisory explains entry through a buyer's situation and makes starting-engagement outputs clearer. Repeated approach and setup language has been shortened.
- AI includes explicitly illustrative knowledge-access and draft-preparation workflows, two entry routes and clearer scoping of Pacific Edge and specialist contributions. The reporting case is labelled as data and reporting experience.
- Supporting case links are available alongside the contents of Advisory and AI, before the main page text. Full Advisory case summaries remain available later on the page. Links retain the same publication controls as the accounts.
- Public contact configuration, final offer scope and product availability remain launch requirements.

### Buyer revision validation

- Astro check: 33 source files, zero diagnostics. Production output: 12 HTML files and 325 local references. Review output: 18 HTML files and 542 local references.
- Browser checks covered 12 routes at 1440, 736, 390 and 320 pixels, with no overflow, clipped content, broken images, failed requests or script exceptions. Mobile navigation and non-submitting contact behavior passed.
- The 12-page standalone preview passed page, imagery and case-navigation checks. First Nations and AI page screenshots were inspected for hierarchy and readability.
