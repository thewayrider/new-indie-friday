import { useLoaderData } from 'react-router';
import { client } from '../client';
import { buildMeta, SITE_URL } from '../seo';
import SpotlightArticle from './SpotlightArticle';

const QUERY = `*[_type == "spotlightArtist" && slug.current == $slug][0]{
  artistName,
  genre,
  location,
  songReleaseDate,
  "imageUrl": image.asset->url,
  "headerImageUrl": headerImage.asset->url,
  spotifyUrl,
  albumLinkUrl,
  blurb[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": reference->slug.current,
        "refType": reference->_type
      }
    }
  }
}`;

export async function loader({ params }) {
  const data = await client.fetch(QUERY, { slug: params.slug });
  return { data: data || null };
}

export function meta({ data, params }) {
  const d = data && data.data;
  if (!d) return buildMeta({ title: 'Spotlight', path: `/spotlight/${params.slug}` });
  const title = `${d.artistName} — Spotlight`;
  const description = `Spotlight on ${d.artistName}${d.genre ? ', ' + d.genre : ''}${d.location ? ', from ' + d.location : ''}.`;
  const image = d.headerImageUrl || d.imageUrl;
  return [
    ...buildMeta({ title, description, path: `/spotlight/${params.slug}`, image, type: 'article' }),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name: d.artistName,
        ...(d.genre ? { genre: d.genre } : {}),
        url: SITE_URL + '/spotlight/' + params.slug,
      },
    },
  ];
}

export default function SpotlightDetail() {
  const { data } = useLoaderData();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Spotlight post not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <SpotlightArticle data={data} />
    </div>
  );
}
