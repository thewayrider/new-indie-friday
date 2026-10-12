// Shared SEO helpers for React Router `meta` exports.
// Produces title, description, Open Graph, Twitter, and canonical tags
// consistently across routes. Individual routes can append JSON-LD.

export const SITE_URL = 'https://www.streamusique.com';
export const SITE_NAME = 'New Indie Friday';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/headphones.png`;
export const DEFAULT_DESCRIPTION =
  'New independent music — indie, alt and surf rock with an Australian and New Zealand focus — curated weekly by Kim Rampling.';

export function buildMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
}) {
  const url = SITE_URL + path;
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — New Independent Music, Curated Weekly`;

  const tags = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
  ];

  if (image) {
    tags.push({ property: 'og:image', content: image });
    tags.push({ name: 'twitter:image', content: image });
    tags.push({ name: 'twitter:card', content: 'summary_large_image' });
  } else {
    tags.push({ name: 'twitter:card', content: 'summary' });
  }

  return tags;
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: 'Streamusique',
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: 'Streamusique',
        url: SITE_URL,
        logo: `${SITE_URL}/headphones.png`,
        founder: {
          '@type': 'Person',
          name: 'Kim Rampling',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'editorial',
            email: 'kim@streamusique.com',
            url: `${SITE_URL}/about`,
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AU',
        },
      },
    ],
  };
}
