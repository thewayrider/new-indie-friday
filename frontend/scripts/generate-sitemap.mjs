// Generates public/sitemap.xml from Sanity content at build time.
// Runs automatically via the "prebuild" npm script before `react-router build`.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://www.kimrampling.com';
const PROJECT_ID = 'oeemrqux';
const DATASET = 'production';
const API_VERSION = '2024-01-01';
const RELEASES_PER_PAGE = 5;

const base = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

async function sanityQuery(query) {
  const res = await fetch(`${base}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = await res.json();
  return json.result;
}

function urlEntry(path, lastmod) {
  const loc = `${SITE_URL}${path}`;
  const mod = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${mod}\n  </url>`;
}

async function main() {
  const [releases, spotlights, releaseCount] = await Promise.all([
    sanityQuery(
      '*[_type == "release" && defined(slug.current)]{"slug": slug.current, _updatedAt} | order(orderRank asc)'
    ),
    sanityQuery(
      '*[_type == "spotlightArtist" && defined(slug.current)]{"slug": slug.current, _updatedAt} | order(featuredDate desc)'
    ),
    sanityQuery('count(*[_type == "release"])'),
  ]);

  const totalPages = Math.ceil((releaseCount || 0) / RELEASES_PER_PAGE);

  const entries = [
    urlEntry('/'),
    urlEntry('/spotlight'),
    urlEntry('/new-releases'),
    urlEntry('/about'),
    urlEntry('/new-music-old-sessions'),
  ];

  for (let p = 2; p <= totalPages; p++) {
    entries.push(urlEntry(`/new-releases/page/${p}`));
  }
  for (const r of releases || []) {
    entries.push(urlEntry(`/new-releases/${r.slug}`, r._updatedAt));
  }
  for (const s of spotlights || []) {
    entries.push(urlEntry(`/spotlight/${s.slug}`, s._updatedAt));
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries.join('\n')}\n` +
    `</urlset>\n`;

  const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`Sitemap written: ${entries.length} URLs -> ${outPath}`);
}

main().catch((err) => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
