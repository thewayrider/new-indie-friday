import { Link, useLoaderData } from 'react-router';
import { PortableText } from '@portabletext/react';
import { client } from '../client';
import { buildMeta } from '../seo';
import { portableTextComponents } from './SpotlightArticle';

const QUERY = `{
  "resources": *[_type == "resourceArticle"] | order(publishedAt desc)[0...50]{
    title,
    teaser,
    "slug": slug.current,
    "imageUrl": coverImage.asset->url,
    externalCoverImageUrl,
    publishedAt,
    author,
    originalSourceUrl,
    originalSourceName,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          "slug": reference->slug.current,
          "refType": reference->_type
        }
      }
    }
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
          <div className="flex flex-col gap-20">
            {resources.map(function (item, i) {
              const displayImageUrl = item.externalCoverImageUrl || item.imageUrl;
              return (
                <article key={item.slug || i} className="flex flex-col items-start gap-6 border-b border-black/10 pb-20 last:border-0 last:pb-0">
                  <div className="w-full">
                    <h2 className="font-fraunces font-black text-3xl md:text-5xl text-black leading-tight mb-4">
                      <Link to={'/resources/' + item.slug} className="hover:text-cobalt transition-colors">
                        {item.title}
                      </Link>
                    </h2>
                    <span className="block text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                      {formatDate(item.publishedAt)}{item.author ? ` • By ${item.author}` : ''}
                    </span>
                  </div>

                  {displayImageUrl && (
                    <div className="w-full my-4">
                      <img
                        src={displayImageUrl}
                        alt={item.title}
                        className="w-full h-auto object-contain object-left max-h-[700px]"
                      />
                    </div>
                  )}

                  <div className="text-gray-800 text-sm md:text-base font-mono leading-relaxed prose prose-stone max-w-none w-full">
                    {item.content ? (
                      <PortableText value={item.content} components={portableTextComponents} />
                    ) : (
                      <p>{item.teaser}</p>
                    )}
                  </div>
                  
                  {item.originalSourceUrl && (
                    <div className="mt-6">
                      <a
                        href={item.originalSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 hover:bg-cobalt transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_#2563eb]"
                      >
                        read the full article here →
                      </a>
                    </div>
                  )}
                </article>
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
