import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://www.streamusique.com';
const SITE_NAME = 'New Indie Friday';
const DEFAULT_DESCRIPTION = 'New independent music — indie, alt and surf rock with an Australian and New Zealand focus — curated weekly by Kim Rampling.';

const PROJECT_ID = 'oeemrqux';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

const base = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

async function sanityQuery(query) {
  const res = await fetch(`${base}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  const json = await res.json();
  return json.result;
}

async function main() {
  const releases = await sanityQuery(`
    *[_type == "release"] | order(orderRank asc)[0...30]{
      _id,
      songTitle,
      artistName,
      "slug": slug.current,
      "albumArtUrl": albumArt.asset->url,
      "blurbText": pt::text(blurb),
      _createdAt
    }
  `);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${DEFAULT_DESCRIPTION}</description>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${releases
      .map(
        (release) => `
    <item>
      <title><![CDATA[${release.songTitle} - ${release.artistName}]]></title>
      <link>${SITE_URL}/new-releases/${release.slug}</link>
      <guid>${SITE_URL}/new-releases/${release.slug}</guid>
      <pubDate>${new Date(release._createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${
        release.albumArtUrl ? `<img src="${release.albumArtUrl}" alt="Artwork" style="max-width:300px"/><br/><br/>` : ''
      }${release.blurbText || ''}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'rss.xml');
  writeFileSync(outPath, rss, 'utf8');
  console.log(`RSS Feed written: ${releases.length} items -> ${outPath}`);
}

main().catch((err) => {
  console.error('RSS generation failed:', err);
  process.exit(1);
});
