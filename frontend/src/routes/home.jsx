import { useLoaderData } from 'react-router';
import { client } from '../client';
import { buildMeta, SITE_URL, DEFAULT_DESCRIPTION } from '../seo';
import Hero from '../components/Hero';
import Releases from '../components/Releases';

export function meta() {
  return [
    ...buildMeta({ path: '/', type: 'website' }),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'New Indie Friday',
        url: SITE_URL,
        description: DEFAULT_DESCRIPTION,
        publisher: {
          '@type': 'Organization',
          name: 'New Indie Friday',
          url: SITE_URL,
        },
      },
    },
  ];
}

// Runs server-side (dev server + build-time prerender), so no browser CORS.
export async function loader() {
  const query = `{
    "spotlightArtist": *[_type == "spotlightArtist" && isCurrent == true] | order(featuredDate desc)[0]{
      artistName,
      teaser,
      "imageUrl": image.asset->url,
      "slug": slug.current
    },
    "releases": *[_type == "release"] | order(orderRank asc)[0...6]{
      _id,
      songTitle,
      artistName,
      releaseType,
      albumOrEpName,
      genre,
      spotifyUrl,
      releaseDate,
      "slug": slug.current,
      "albumArtUrl": albumArt.asset->url
    }
  }`;

  const res = await client.fetch(query);
  return {
    spotlightArtist: res.spotlightArtist || null,
    releases: res.releases || [],
  };
}

export default function Home() {
  const { spotlightArtist, releases } = useLoaderData();
  return (
    <>
      <Hero spotlightArtist={spotlightArtist} isLoading={false} />
      <Releases releases={releases} />
    </>
  );
}
