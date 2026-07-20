import { Link, useLoaderData } from 'react-router';
import { client } from '../client';
import { buildMeta } from '../seo';
import SpotlightArticle from './SpotlightArticle';

const QUERY = `{
"latest": *[_type == "spotlightArtist"] | order(featuredDate desc)[0]{
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
  },
  "older": *[_type == "spotlightArtist"] | order(featuredDate desc)[1...50]{
    artistName,
    teaser,
    "imageUrl": image.asset->url,
    "slug": slug.current,
    featuredDate
  }
}`;

export async function loader() {
  const res = await client.fetch(QUERY);
  return {
    latest: res.latest || null,
    older: res.older || [],
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function meta({ data }) {
  const latest = data && data.latest;
  const title = latest ? `Spotlight: ${latest.artistName}` : 'Spotlight';
  const description = latest
    ? `This week's spotlight: ${latest.artistName}${latest.genre ? ' — ' + latest.genre : ''}${latest.location ? ', ' + latest.location : ''}.`
    : 'Weekly spotlight on a new independent artist.';
  const image = latest ? latest.headerImageUrl || latest.imageUrl : undefined;
  return buildMeta({ title, description, path: '/spotlight', image, type: 'article' });
}

export default function SpotlightListing() {
  const { latest, older } = useLoaderData();

  return (
    <div className="bg-[#e8e2d9] min-h-screen">

      {latest ? (
        <SpotlightArticle data={latest} />
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <p className="font-mono text-sm text-gray-500">No Spotlight posts yet.</p>
        </div>
      )}

      {older.length > 0 ? (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-14">
          <div className="border-t-2 border-black/70 pt-10">
            <h3 className="font-mono text-[11px] font-black uppercase tracking-[0.25em] text-black/60 mb-8">
              Previous Spotlights
            </h3>

            <div className="space-y-8">
              {older.map(function (item, i) {
                return (
                  <Link
                    key={item.slug || i}
                    to={'/spotlight/' + item.slug}
                    className="group flex items-start gap-5 pb-8 border-b border-black/10 last:border-b-0"
                  >
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.artistName}
                          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        {formatDate(item.featuredDate)}
                      </span>
                      <h4 className="font-fraunces font-black text-lg text-black group-hover:text-gray-700 transition-colors leading-tight mt-1">
                        {item.artistName}
                      </h4>
                      <p className="text-gray-600 text-xs md:text-sm font-mono leading-relaxed mt-1 line-clamp-2">
                        {item.teaser}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
