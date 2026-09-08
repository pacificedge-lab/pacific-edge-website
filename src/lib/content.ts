import type { CollectionEntry } from 'astro:content';

export function visible<T extends { data: { status: string } }>(entry: T) {
  return import.meta.env.PROD ? entry.data.status === 'published' : entry.data.status !== 'archived';
}

export function sortByOrder<T extends { data: { order: number } }>(entries: T[]) {
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export function titleFromKind(kind: CollectionEntry<'ideas'>['data']['kind']) {
  return kind
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}
