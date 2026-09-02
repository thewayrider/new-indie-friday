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
    category,
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

  const articlesList = resources.filter(r => r.category !== 'resource');
  const resourcesList = resources.filter(r => r.category === 'resource');

  const renderItem = (item, i) => {
    const displayImageUrl = item.externalCoverImageUrl || item.imageUrl;
    
    return (
      <article key={item.slug || i} className="flex flex-col items-start gap-4 border-b border-black/10 pb-10 last:border-0 last:pb-0 w-full">
        <div className="flex justify-between items-start gap-4 w-full">
          <div className="flex-1">
            <h3 className="font-fraunces font-black text-2xl md:text-3xl text-black leading-tight mb-3">
              <Link to={'/resources/' + item.slug} className="hover:text-cobalt transition-colors">
                {item.title}
              </Link>
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base font-mono uppercase tracking-wider mb-2">
              {item.author && (
                <span className="font-bold text-black border border-black px-2 py-1 rounded-sm bg-white">
                  By {item.author}
                </span>
              )}
              <span className="text-gray-500 text-xs md:text-sm pt-1">{formatDate(item.publishedAt)}</span>
            </div>
          </div>
          
          {displayImageUrl && (
            <div className="flex-shrink-0 pt-2">
              <img 
                src={displayImageUrl} 
                alt=""
                className="w-16 h-16 md:w-20 md:h-20 object-cover border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
              />
            </div>
          )}
        </div>

        <div className="text-gray-800 text-sm md:text-base font-mono leading-relaxed prose prose-stone max-w-none w-full">
        {item.content ? (
          <PortableText value={item.content} components={portableTextComponents} />
        ) : (
          <p>{item.teaser}</p>
        )}
      </div>
      
      <div className="mt-2">
        {item.originalSourceUrl ? (
          <a
            href={item.originalSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 hover:bg-cobalt transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_#2563eb]"
          >
            read the full article here →
          </a>
        ) : (
          <Link 
            to={'/resources/' + item.slug} 
            className="inline-block border-2 border-black text-black text-[11px] font-black uppercase tracking-widest px-6 py-3 hover:bg-black hover:text-white transition-colors"
          >
            Read More →
          </Link>
        )}
      </div>
    </article>
    );
  };

  return (
    <div className="bg-[#e8e2d9] min-h-screen pt-14 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-fraunces font-black tracking-tighter uppercase leading-none text-black mb-4 flex items-center">
          <span>Resources</span>
          <img 
            src="/favicon-black.png" 
            alt="" 
            aria-hidden="true" 
            className="inline-block w-[0.58em] h-[0.58em] md:w-[0.62em] md:h-[0.62em] ml-2 md:ml-3 align-middle opacity-95 select-none object-contain"
          />
        </h1>
        <p className="text-gray-600 font-mono text-sm md:text-base max-w-2xl mb-12">
          Articles and guides to help independent artists navigate the music industry.
        </p>

        {resources.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left Column - Resources */}
            <div className="flex-1 w-full bg-[#dfd8cf] p-6 md:p-8 rounded-sm border border-black/5">
              <h2 className="text-xl md:text-2xl font-mono uppercase tracking-widest text-black mb-8 pb-4 border-b border-black/10">New Artist Resources</h2>
              {resourcesList.length > 0 ? (
                <div className="flex flex-col gap-12">
                  {resourcesList.map(renderItem)}
                </div>
              ) : (
                <p className="font-mono text-sm text-gray-500">No resources available.</p>
              )}
            </div>

            {/* Right Column - Articles */}
            <div className="flex-1 w-full bg-[#dfd8cf] p-6 md:p-8 rounded-sm border border-black/5">
              <h2 className="text-xl md:text-2xl font-mono uppercase tracking-widest text-black mb-8 pb-4 border-b border-black/10">Articles</h2>
              {articlesList.length > 0 ? (
                <div className="flex flex-col gap-12">
                  {articlesList.map(renderItem)}
                </div>
              ) : (
                <p className="font-mono text-sm text-gray-500">No articles available yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-black/70 pt-10 mt-10">
            <p className="font-mono text-sm text-gray-500">No content available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
