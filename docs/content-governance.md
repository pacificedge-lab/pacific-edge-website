# Content Governance

Every public content object carries a publication status.

- `draft`
- `review`
- `approved`
- `published`
- `archived`

Production pages render only `published` entries. Work marked `internal` is excluded even when published. Development renders draft, review, approved and published entries so content can be reviewed in context; archived and unknown statuses are excluded. Development previews are private editorial tools, not deployment artifacts.

Partners require both `status: published` and `publish: true`, even in development. The homepage additionally requires `featured: true`. Partner content should never appear until the relationship has been approved for representation.

Work content should be reviewed for confidentiality before publication.

See [PR4 governance and editorial review](pr4-about-contact-governance.md) for promotion steps, confidentiality checks, partner metadata and the explicit contact activation gate.
