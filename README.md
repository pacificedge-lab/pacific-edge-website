# Pacific Edge Website

Public website for Pacific Edge.

## Stack

- Astro
- TypeScript
- Markdown content collections
- CSS custom properties and component styles
- Cloudflare Workers with Static Assets (deployment target)

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Content

Public content lives under `src/content/` and is validated by `src/content.config.ts`.

Collections currently include:

- `work`
- `labs`
- `ideas`
- `partners`
- `people`

Draft entries are visible during local development but are excluded from production output until their `status` is set to `published`.

## Contact form

The contact page is deliberately fail-safe. The form remains disabled unless `PUBLIC_CONTACT_ENDPOINT` is configured.

## Deployment

The initial posture is static-first. `npm run build` generates the site in `dist/`. Cloudflare Workers Static Assets is the intended deployment target. Server-side functionality should be introduced only when it has a real requirement.

## Governing principle

> Build the substrate for the institution. Publish only the visible edge.
