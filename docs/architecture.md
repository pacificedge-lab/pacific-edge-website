# Architecture

## Principle

The website is a publishing surface over durable, inspectable content rather than the canonical owner of Pacific Edge knowledge.

## Current stack

- Astro static output
- Markdown content collections
- CSS tokens and semantic aliases
- Cloudflare Workers Static Assets target
- no database
- no conventional CMS

## Content flow

```text
Markdown / structured content
          ↓
      Astro build
          ↓
     HTML / CSS / assets
          ↓
 Cloudflare global network
```

Dynamic behaviour should be added only where required. The first likely dynamic surface is contact-form handling.
