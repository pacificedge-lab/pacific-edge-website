# PR4 — About, Contact and content governance

Based on PR3 (`feat/editorial-detail-templates`). Merge the earlier PRs in order before retargeting this PR to main.

About now presents the practice through an editorial introduction, purpose, paired Advisory/Labs section and contact invitation. Copy stays grounded in the existing positioning; no people, clients or achievements have been invented.

Contact presents the four launch fields. Until activation, there is no form element or action: a disabled fieldset and button show the intended layout alongside an explicit unavailable notice. Nothing can be entered or submitted. No file upload, budget, service selector or lead-scoring fields are included.

## Publication rules

Production requires `status: published`. Work marked `confidentiality: internal` is excluded even if published. Local development includes draft, review, approved and published records; archived and unknown statuses are excluded. Never expose a development server publicly: it intentionally includes unpublished content.

Partners require both published status and the explicit publish flag, including in local previews. Featured additionally controls homepage inclusion. Optional mark and related Work/Labs/Capabilities fields complete the dormant data structure. A mark is a repo asset path, and related Work/Labs values are content IDs; these optional relationships are not rendered or resolved yet. No partner record or visible navigation was added.

Empty Work, Labs and Ideas listings now explain that entries will appear when ready and provide a route to Contact.

## Editorial review before promotion

1. Verify statements, scope and supporting evidence. The AI Work story remains a body of work.
2. Check confidentiality and permission for names, client descriptions, marks and partner relationships. Anonymized is an editorial designation, not automatic redaction.
3. Preview the Markdown locally, including metadata and related-entry links.
4. Move draft to review, then approved. Approval alone does not publish.
5. Change status to published only as an explicit editorial decision in a reviewed PR. For Work, confirm confidentiality is public or genuinely anonymized. For Partners, also set publish true after relationship approval.
6. Build production output and inspect the published routes. Archive by setting status to archived and rebuilding.

## Contact activation (PR5)

Both `PUBLIC_CONTACT_ENABLED=true` and a valid `PUBLIC_CONTACT_ENDPOINT` are required. Accepted endpoints are single-slash same-origin paths or HTTPS URLs without credentials or fragments. The default is disabled; an endpoint alone does not activate submission. These are public build-time values, never secrets. Rebuild after changing them.

Activation still depends on PR5 delivering and verifying the real submission endpoint and its response behaviour. Endpoint string validation does not prove that a service exists or handles submissions correctly.

## Checks

Run `node scripts/check-governance.mjs` (Node 22.18+ or 24+) for the status/partner/contact activation matrix. Run the standard Astro check/build, then `node scripts/check-publication.mjs` for the current endpoint-free production baseline. The existing detail-preview check remains useful for all nine local draft routes.
