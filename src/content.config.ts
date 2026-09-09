import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const status = z.enum(['draft', 'review', 'approved', 'published', 'archived']);

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status,
    featured: z.boolean().default(false),
    domains: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
    confidentiality: z.enum(['public', 'anonymized', 'internal']).default('public'),
    order: z.number().default(100),
  }),
});

const labs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status,
    featured: z.boolean().default(false),
    projectType: z.enum(['product', 'prototype', 'experiment', 'internal-system']),
    developmentStatus: z.string(),
    github: z.string().url().optional(),
    order: z.number().default(100),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status,
    featured: z.boolean().default(false),
    kind: z.enum(['field-note', 'framework', 'research', 'briefing', 'essay']),
    publishedAt: z.coerce.date().optional(),
    order: z.number().default(100),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    relationship: z.enum(['delivery', 'technology', 'strategic']),
    website: z.string().url().optional(),
    mark: z.string().optional(),
    relatedWork: z.array(z.string()).default([]),
    relatedLabs: z.array(z.string()).default([]),
    relatedCapabilities: z.array(z.string()).default([]),
    status,
    publish: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    summary: z.string(),
    status,
    order: z.number().default(100),
  }),
});

export const collections = { work, labs, ideas, partners, people };
