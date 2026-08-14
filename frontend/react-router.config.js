/** @type {import('@react-router/dev/config').Config} */

const SANITY_PROJECT_ID = 'oeemrqux';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const RELEASES_PER_PAGE = 5;

const sanityBase = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

async function sanityQuery(query) {
  const res = await fetch(`${sanityBase}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity prerender query failed: ${res.status}`);
  const json = await res.json();
  return json.result;
}

export default {
  appDirectory: 'src',

  // No runtime server — we prerender to static HTML instead
  ssr: false,

  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },

  // Build-time: enumerate every page to prerender, pulling slugs from Sanity.
  async prerender() {
    const [releaseSlugs, spotlightSlugs, releaseCount] = await Promise.all([
      sanityQuery('*[_type == "release" && defined(slug.current)].slug.current'),
      sanityQuery('*[_type == "spotlightArtist" && defined(slug.current)].slug.current'),
      sanityQuery('count(*[_type == "release"])'),
    ]);

    const totalPages = Math.ceil((releaseCount || 0) / RELEASES_PER_PAGE);
    const pagePaths = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePaths.push(`/new-releases/page/${p}`);
    }

    return [
      '/',
      '/spotlight',
      '/new-releases',
      '/about',
      '/new-music-old-sessions',
      ...pagePaths,
      ...(releaseSlugs || []).map((s) => `/new-releases/${s}`),
      ...(spotlightSlugs || []).map((s) => `/spotlight/${s}`),
    ];
  },
};