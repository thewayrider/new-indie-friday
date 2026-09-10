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
    "releases": *[_type == "release"] | order(orderRank asc)[0...12]{
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
    },
    "homePage": *[_type == "homePage"][0]{
      spotifyPlaylistUrl,
      curatorSelectionTitle
    }
  }`;

  const res = await client.fetch(query);
  return {
    spotlightArtist: res.spotlightArtist || null,
    releases: res.releases || [],
    homePage: res.homePage || null,
  };
}

export default function Home() {
  const { spotlightArtist, releases, homePage } = useLoaderData();
  return (
    <>
      <div className="sr-only">
        <h1>New Indie Friday - Discover New Independent Music</h1>
        <p>
          Welcome to New Indie Friday, your curated weekly destination for discovering the best new independent music. Every Friday, curator Kim Rampling meticulously selects and highlights the latest and greatest releases across indie rock, alternative rock, surf rock, and post-punk, with a special focus on the vibrant music scenes of Australia and New Zealand. Whether you are looking for our featured Artist Spotlight, uncovering hidden gems in our Weekly Picks, or diving into deep retrospective reviews of classic indie tracks in our Old Sessions, we provide a rich, distraction-free listening experience. Dive into our hand-picked selections, stream the tracks directly, and support independent musicians globally. Stay in the loop with our weekly newsletter and never miss a drop!
        </p>
      </div>
      <Hero spotlightArtist={spotlightArtist} isLoading={false} />
      <Releases releases={releases} homePage={homePage} />
    </>
  );
}
