import { useLoaderData } from 'react-router';
import { client } from '../client';
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
