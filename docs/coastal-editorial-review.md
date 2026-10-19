# Coastal Editorial implementation review

Approved design direction from Chris McLean on 15 October 2026. Implements Website Brief revision 0.6 and Copy Draft 0.6. This branch is a review draft; it is not a launch approval.

## Repository review and retained foundation

- Keep Astro, static output, TypeScript, local fonts, Markdown collections and Cloudflare Workers Static Assets as the deployment target.
- Replace the earlier four capability areas with Strategy and direction, Operations and capability, and Advisory and leadership.
- Add dedicated AI and First Nations routes, retain Labs, and add a substantive founder introduction.
- Use the approved coastal composition and palette. Self-host Inter and Source Serif 4 to carry the sans-serif body and editorial headings into production.
- Preserve the wider draft portfolio in source as archived entries. Earlier work summaries lacked substantive case accounts and must not imply verified delivery evidence.
- Keep named partners behind their status and explicit publication flag. Internal work is excluded even in review mode.
- The assets are supplied brand atmosphere and a supplied founder portrait. They do not represent client sites, assignments or partners.

## Review modes

Development shows review content. For a production-style review build, run `npm run build:review`. It explicitly enables review mode, disables the contact form and validates the output. The build includes a draft banner, noindex metadata, an empty sitemap, the ISEF review entry and the two anonymized case accounts. Noindex is not access control: keep the review build local or behind real private access.

A default production build excludes unpublished collection items and the work placeholders. Unconfirmed partner links are omitted. Contact inputs are always disabled in review. Public output offers direct email while form switches and the Turnstile key remain unconfigured.

## Content needed from Chris

- Two substantive case accounts are integrated: fibre delivery operating-model design and reporting recovery within an urgent workforce implementation. Chris approved the editorial direction and general client descriptions. Final website wording remains in review status pending publication approval; client and employer names are excluded.
- Confirm partner names, expertise, working arrangements and agreed public descriptions. The site is designed to remain complete while these are pending.
- Review the founder biography and provide a short personal perspective if desired.
- Confirm the scope and delivery capacity behind the initial engagements, including funding pathways and specialist implementation.
- Confirm ISEF Support's public name, summary and availability before publishing its entry. Its current review stage is Preparing for launch.
- Public mailbox hello@thepacificedge.ca is confirmed operational. Complete the Cloudflare configuration and hosted delivery acceptance in docs/contact-setup.md, and review the enquiry privacy page.

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

## Case attribution presentation - 17 October 2026

Case context and experience attribution now form one sentence in a single caption, such as "From Chris McLean's prior professional experience with a major provincial health organization." This treatment is shared by Home, Advisory, Selected Work and the full accounts. It replaces the two unlabelled stacked fragments while preserving the distinction between earlier experience and Pacific Edge assignments.

The caption is presented in a separate Experience context block with a small uppercase label, a quiet background and an accent rule. This differentiates the attribution from the preceding narrative on cards and full accounts.


## Contact implementation - 18 October 2026

The public mailbox is confirmed operational. The form now has a Worker submission handler, server-side Turnstile verification, rate limiting, fixed-recipient email delivery, visitor Reply-To, status feedback and an enquiry privacy page. The public form and Worker delivery remain disabled pending Cloudflare account configuration and hosted acceptance. Local testing uses simulated services and synthetic data; no emails are sent. See docs/contact-setup.md for the remaining account steps.

### Contact implementation validation

- Handler tests: 18 passing checks using simulated verification, rate limiting and email. These cover fixed delivery addresses, validation, body limits, origin checks, disabled or missing configuration and service failures.
- Astro check: 36 source files, zero diagnostics. Default production output: 13 HTML files and 360 local references. Enabled-form fixture: 13 HTML files and 361 references. Review output: 19 HTML files and 585 references.
- Browser tests of the enabled form intercepted every submission and verification request. Duplicate clicks produced one request; failed and interrupted attempts preserved the message; confirmed success cleared it. No real email was sent.
- Browser layout checks passed for 13 routes at 1440, 736, 390 and 320 pixels, with no overflow, clipped content, broken images, failed requests or script exceptions. Mobile navigation passed.
- Review mode kept the form disabled even with the public enable switch and a synthetic Turnstile sitekey supplied. The standalone 13-page preview passed page, imagery and case-navigation checks.
- Release checks continue to block publication pending real Cloudflare configuration, hosted delivery acceptance and final content approval. Local checks do not verify account availability or email receipt.

## Homepage positioning - 18 October 2026

Chris clarified that First Nations work is relevant experience, but Pacific Edge is not being positioned primarily as a First Nations consultancy. The homepage now leads with the broad strategy, operations and leadership offer, followed by selected experience and AI and automation. The large First Nations image section is replaced by a short linked paragraph within the services section. The dedicated First Nations page and navigation link remain available; Labs retains its proportionate ISEF reference.

Chris confirmed that the hosted review banner, draft case accounts and disabled contact form are now present after updating the existing feature Preview's own settings. Previews Base settings alone did not update that existing Preview. For future build-setting changes, check the specific Preview configuration as well as Base.

Validation: Astro check returned zero diagnostics across 37 files. Review output passed 19 HTML-file and 585 local-reference checks; production output passed 13 HTML-file and 360 local-reference checks. These checks cover publication controls and links. The revised homepage still needs visual inspection on the hosted Preview; a browser connection was not available for this change.

Chris preferred the reduced First Nations emphasis but identified an awkward alignment in the services section. The recovery heading, explanatory copy and link now stack along the same left edge. The First Nations note follows at the same reading width, separated by a subtle rule. This replaces the recovery section's split desktop columns; mobile follows the same reading order. Content and publication controls are unchanged.

The alignment revision passed the explicit review build and its 19 HTML-file / 585 local-reference output checks. Hosted visual acceptance of the revised spacing remains pending.
