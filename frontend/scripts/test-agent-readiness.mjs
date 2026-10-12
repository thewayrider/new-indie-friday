import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '..');

console.log('--- RUNNING AGENT READINESS & PROTOCOL VERIFICATION TESTS ---');

// Test 1: SEO buildMeta() output for homepage
console.log('Test 1: Verifying SEO buildMeta() outputs all required metadata signals...');
const { buildMeta, getOrganizationJsonLd, DEFAULT_OG_IMAGE, SITE_URL } = await import('../src/seo.js');
const homeMeta = buildMeta({ path: '/', type: 'website' });

const hasCanonical = homeMeta.some(
  (t) => t.tagName === 'link' && t.rel === 'canonical' && t.href === `${SITE_URL}/`
);
const hasOgType = homeMeta.some(
  (t) => t.property === 'og:type' && t.content === 'website'
);
const hasOgImage = homeMeta.some(
  (t) => t.property === 'og:image' && t.content === DEFAULT_OG_IMAGE
);
const hasTwitterImage = homeMeta.some(
  (t) => t.name === 'twitter:image' && t.content === DEFAULT_OG_IMAGE
);

assert.ok(hasCanonical, 'FAIL: canonical tag missing in buildMeta');
assert.ok(hasOgType, 'FAIL: og:type tag missing in buildMeta');
assert.ok(hasOgImage, 'FAIL: og:image tag missing in buildMeta');
assert.ok(hasTwitterImage, 'FAIL: twitter:image tag missing in buildMeta');
console.log('✓ PASS: All 4 metadata signals (canonical, og:type, og:image, twitter:image) present.');

// Test 2: Organization Schema JSON-LD
console.log('Test 2: Verifying Organization & WebSite JSON-LD completeness...');
const jsonLd = getOrganizationJsonLd();
assert.ok(jsonLd && jsonLd['@graph'], 'FAIL: script:ld+json @graph missing');

const graph = jsonLd['@graph'];
assert.ok(Array.isArray(graph), 'FAIL: JSON-LD @graph is not an array');

const org = graph.find((item) => item['@type'] === 'Organization');
assert.ok(org, 'FAIL: Organization entity missing in @graph');
assert.equal(org.name, 'New Indie Friday');
assert.equal(org.alternateName, 'Streamusique');
assert.ok(org.logo, 'FAIL: Organization logo missing');

assert.ok(Array.isArray(org.contactPoint) && org.contactPoint.length > 0, 'FAIL: contactPoint missing or empty');
assert.equal(org.contactPoint[0].contactType, 'editorial');
assert.ok(org.contactPoint[0].email, 'FAIL: contactPoint email missing');

assert.ok(org.address && org.address['@type'] === 'PostalAddress', 'FAIL: address (PostalAddress) missing');
assert.equal(org.address.addressCountry, 'AU');
console.log('✓ PASS: Organization schema includes contactPoint, address, logo, and brand identifiers.');

// Test 3: Public 404.html agent-readiness
console.log('Test 3: Verifying public/404.html recovery links and format...');
const fourOhFourPath = path.join(frontendDir, 'public', '404.html');
assert.ok(fs.existsSync(fourOhFourPath), 'FAIL: public/404.html does not exist');
const fourOhFourContent = fs.readFileSync(fourOhFourPath, 'utf8');

assert.ok(fourOhFourContent.includes('404 Not Found'), 'FAIL: 404 title/heading missing in 404.html');
assert.ok(fourOhFourContent.includes('/sitemap.xml'), 'FAIL: sitemap.xml recovery link missing in 404.html');
assert.ok(fourOhFourContent.includes('/llms.txt'), 'FAIL: llms.txt recovery link missing in 404.html');
assert.ok(fourOhFourContent.includes('/new-releases'), 'FAIL: /new-releases link missing in 404.html');
console.log('✓ PASS: public/404.html contains clean error markup with agent recovery links.');

// Test 4: Public llms.txt format & brand attribution
console.log('Test 4: Verifying public/llms.txt content and brand attribution...');
const llmsPath = path.join(frontendDir, 'public', 'llms.txt');
assert.ok(fs.existsSync(llmsPath), 'FAIL: public/llms.txt does not exist');
const llmsContent = fs.readFileSync(llmsPath, 'utf8');

assert.ok(llmsContent.includes('https://www.streamusique.com'), 'FAIL: Canonical URL missing in llms.txt');
assert.ok(llmsContent.includes('New Indie Friday'), 'FAIL: Brand Name missing in llms.txt');
assert.ok(llmsContent.includes('Streamusique'), 'FAIL: Alternate Name missing in llms.txt');
assert.ok(llmsContent.includes('Accept: text/markdown'), 'FAIL: Content negotiation docs missing in llms.txt');
console.log('✓ PASS: public/llms.txt contains proper entity definitions, brand signals, and endpoint mappings.');

// Test 5: Vercel vercel.json caching headers
console.log('Test 5: Verifying vercel.json Vary headers and no soft-404 rewrites...');
const vercelConfigPath = path.join(frontendDir, 'vercel.json');
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

const allRoutesHeader = vercelConfig.headers?.find((h) => h.source === '/(.*)');
assert.ok(allRoutesHeader, 'FAIL: Root headers definition missing in vercel.json');

const varyHeader = allRoutesHeader.headers?.find((h) => h.key === 'Vary');
assert.ok(varyHeader, 'FAIL: Vary header missing in vercel.json');
assert.ok(varyHeader.value.includes('Accept'), 'FAIL: Vary header must include Accept');
assert.ok(varyHeader.value.includes('Accept-Encoding'), 'FAIL: Vary header must include Accept-Encoding');

const hasCatchAllRewrite = vercelConfig.rewrites?.some((r) => r.source === '/(.*)');
assert.ok(!hasCatchAllRewrite, 'FAIL: vercel.json must not have a catch-all rewrite that breaks real 404s');
console.log('✓ PASS: vercel.json sets Vary: Accept, Accept-Encoding and contains no soft-404 rewrites.');

// Test 6: Middleware export structure
console.log('Test 6: Verifying middleware.js export and config matcher...');
const middlewarePath = path.join(frontendDir, 'middleware.js');
assert.ok(fs.existsSync(middlewarePath), 'FAIL: middleware.js does not exist');
const middlewareModule = await import('../middleware.js');
assert.ok(typeof middlewareModule.default === 'function', 'FAIL: middleware default handler missing');
assert.ok(middlewareModule.config && middlewareModule.config.matcher, 'FAIL: middleware matcher missing');
console.log('✓ PASS: middleware.js has valid handler and matcher configured.');

console.log('\n>>> ALL 6 AGENT READINESS TESTS PASSED SUCCESSFULLY! <<<\n');
