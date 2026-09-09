# PR3 — Work, Labs and Ideas detail templates

PR3 is based on the PR2 homepage branch while PR2 remains open. Review its diff against `feat/homepage-visual-system`; merge PR2 before retargeting PR3 to `main`.

## Templates

- Work: editorial title and summary, discipline/capability context, Markdown narrative and up to two other Work entries.
- Labs: dark hero with matching navigation contrast, project type and development status, Markdown body and up to two other Labs entries.
- Ideas: reading-focused title and body, format, a publication date only when provided, article Open Graph type, and up to two other Ideas.

All variants share collection-return navigation, readable prose, responsive metadata placement and a closing contact invitation. Markdown styles cover headings, lists, quotes, images, code blocks and tables. A contents list appears only for three or more second-level headings, so short notes stay uncluttered.

## Publication and content

Route generation and related-entry queries both use the existing visibility filter. Production still requires `published`; development renders non-archived entries. Related entries exclude the current entry, follow collection order and stop at two. Empty related sections are omitted.

No source narrative or publication status was changed. Existing short drafts remain short drafts: no fabricated client names, metrics, outcomes, author biographies, screenshots or demo links were added. Longer approved narratives can be added to Markdown without changing these templates.

## Verification

- Astro diagnostics: zero errors and warnings at warning severity. Existing schema deprecation hints remain outside this change.
- Static production build and `node scripts/check-publication.mjs`: all nine unpublished entries excluded, eight static pages, valid local links, no client scripts, dormant Partners and disabled contact.
- With the development server running, `node scripts/check-detail-preview.mjs` exercises all nine current draft routes: page variant, one h1, collection navigation, social type, related-entry count and no self-links. Labs also checks the dark-header variant and status metadata. This is a check of the current launch draft set; adapt it when archived records or a different content set is introduced.
- Browser review of all three visual variants; representative Work, Labs and Ideas routes have no horizontal overflow at 320, 768 and 1440 pixels. Mobile Ideas reading layout reviewed at 390 pixels.

The longer Markdown elements and optional contents list are supported by the template but are not present in the current short drafts. Comprehensive accessibility, SEO and performance launch QA remains PR6.
