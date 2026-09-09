type Entry = { data: { status: string; confidentiality?: string } };
const previewStatuses = new Set(['draft', 'review', 'approved', 'published']);

export function visibleIn(entry: Entry, production: boolean) {
  return production
    ? entry.data.status === 'published' && entry.data.confidentiality !== 'internal'
    : previewStatuses.has(entry.data.status);
}

export function partnerPublished(entry: Entry & { data: { publish: boolean } }) {
  return entry.data.status === 'published' && entry.data.publish;
}

export function contactAction(endpoint: string | undefined, enabled: string | undefined) {
  if (enabled !== 'true' || !endpoint?.trim()) return undefined;
  const value = endpoint.trim();
  if (/[\\\s]/.test(value)) return undefined;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash ? url.href : undefined;
  } catch { return undefined; }
}
