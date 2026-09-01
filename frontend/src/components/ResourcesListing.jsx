import { Link, useLoaderData } from 'react-router';
import { client } from '../client';
import { buildMeta } from '../seo';

const QUERY = `{
  "resources": *[_type == "resourceArticle"] | order(publishedAt desc)[0...50]{
    title,
    teaser,
    "slug": slug.current,
    "imageUrl": coverImage.asset->url,
    publishedAt
  }
}`;

export async function loader() {
  const res = await client.fetch(QUERY);
  return {
    resources: res.resources || [],
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

export function meta() {
  return buildMeta({ 
    title: 'Resources', 
    description: 'Articles and resources for independent artists.',
    path: '/resources',
  });
}

export default function ResourcesListing() {
  const { resources } = useLoaderData();

  return (
    <div className="bg-[#e8e2d9] min-h-screen pt-14 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-fraunces font-black tracking-tighter uppercase leading-none text-black mb-4">
          Resources
        </h1>
        <p className="text-gray-600 font-mono text-sm md:text-base max-w-2xl mb-12">
          Articles and guides to help independent artists navigate the music industry.
        </p>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resources.map(function (item, i) {
              return (
                <Link
                  key={item.slug || i}
                  to={'/resources/' + item.slug}
                  className="group flex flex-col items-start gap-4"
                >
                  <div className="w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-black/5 border border-black/10">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="font-mono text-xs text-gray-500 uppercase">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                      {formatDate(item.publishedAt)}
                    </span>
                    <h3 className="font-fraunces font-black text-2xl text-black group-hover:text-cobalt transition-colors leading-tight mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-mono leading-relaxed line-clamp-3">
                      {item.teaser}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border-t-2 border-black/70 pt-10 mt-10">
            <p className="font-mono text-sm text-gray-500">No resources available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
