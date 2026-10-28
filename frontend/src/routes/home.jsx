import { useLoaderData } from 'react-router';
import { client } from '../client';
import { buildMeta, getOrganizationJsonLd } from '../seo';
import Hero from '../components/Hero';
import Releases from '../components/Releases';

export function meta() {
  return [
    ...buildMeta({ path: '/', type: 'website' }),
    {
      'script:ld+json': getOrganizationJsonLd(),
    },
  ];
}

// Runs server-side (dev server + build-time prerender), so no browser CORS.
export async function loader() {
  const query = `{
    "spotlightArtist": *[_type == "spotlightArtist" && isCurrent == true] | order(featuredDate desc)[0]{
      artistName,
      featureCategory,
      albumSubtitle,
      albumLinkUrl,
      teaser,
      featuredDate,
      "imageUrl": image.asset->url,
      "slug": slug.current
    },
    "alumniArtists": *[_type == "spotlightArtist" && defined(subsequentReleases) && count(subsequentReleases) > 0]{
      artistName,
      "slug": slug.current,
      subsequentReleases
    },
    "releases": *[_type == "release"] | order(orderRank asc)[0...12]{
      _id,
      songTitle,
      artistName,
      releaseType,
      albumOrEpName,
      genre,
      musicPlatform,
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

  // Flatten all subsequent releases, sort by release date descending, filter to recent (last 30 days) & max 3
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();

  const alumniReleases = (res.alumniArtists || [])
    .flatMap((artist) =>
      (artist.subsequentReleases || []).map((rel) => ({
        ...rel,
        artistName: artist.artistName,
        artistSlug: artist.slug,
      }))
    )
    .filter((rel) => {
      if (!rel.releaseDate) return true;
      const releaseTime = new Date(rel.releaseDate).getTime();
      return now.getTime() - releaseTime <= THIRTY_DAYS_MS;
    })
    .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
    .slice(0, 3);

  return {
    spotlightArtist: res.spotlightArtist || null,
    releases: res.releases || [],
    homePage: res.homePage || null,
    alumniReleases,
  };
}

export default function Home() {
  const { spotlightArtist, releases, homePage, alumniReleases } = useLoaderData();
  return (
    <>
      <div className="sr-only">
        <h1>New Indie Friday - Discover New Independent Music</h1>
        <p>
          Welcome to New Indie Friday, your curated weekly destination for discovering the best new independent music. Every Friday, curator Kim Rampling meticulously selects and highlights the latest and greatest releases across indie rock, alternative rock, surf rock, and post-punk, with a special focus on the vibrant music scenes of Australia and New Zealand. Whether you are looking for our featured Artist Spotlight, uncovering hidden gems in our Weekly Picks, or diving into deep retrospective reviews of classic indie tracks in our Old Sessions, we provide a rich, distraction-free listening experience. Dive into our hand-picked selections, stream the tracks directly, and support independent musicians globally. Stay in the loop with our weekly newsletter and never miss a drop!
        </p>
      </div>
      <Hero spotlightArtist={spotlightArtist} isLoading={false} />
      <Releases releases={releases} homePage={homePage} alumniReleases={alumniReleases} />
    </>
  );
}
