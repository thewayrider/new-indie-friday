import { useLoaderData, Link } from 'react-router';
import { PortableText } from '@portabletext/react';
import { client } from '../client';
import { buildMeta, SITE_URL } from '../seo';
import { portableTextComponents } from './SpotlightArticle';

const QUERY = `*[_type == "resourceArticle" && slug.current == $slug][0]{
  title,
  "imageUrl": coverImage.asset->url,
  externalCoverImageUrl,
  publishedAt,
  author,
  originalSourceName,
  originalSourceUrl,
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
}`;

export async function loader({ params }) {
  const data = await client.fetch(QUERY, { slug: params.slug });
  return { data: data || null };
}

export function meta({ data, params }) {
  const d = data && data.data;
  if (!d) return buildMeta({ title: 'Resource', path: `/resources/${params.slug}` });
  
  const title = `${d.title} — Resources`;
  const description = `Read ${d.title} on New Indie Friday.`;
  const image = d.externalCoverImageUrl || d.imageUrl;
  
  return [
    ...buildMeta({ title, description, path: `/resources/${params.slug}`, image, type: 'article' }),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: d.title,
        datePublished: d.publishedAt,
        url: SITE_URL + '/resources/' + params.slug,
      },
    },
  ];
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ResourceDetail() {
  const { data } = useLoaderData();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Resource not found.</p>
      </div>
    );
  }

  const { title, imageUrl, externalCoverImageUrl, publishedAt, content, author, originalSourceName, originalSourceUrl } = data;
  const formattedDate = formatDate(publishedAt);
  const displayImageUrl = externalCoverImageUrl || imageUrl;

  return (
    <div className="bg-[#e8e2d9] min-h-screen pb-20">
      
      {/* Header section with title and back link */}
      <div className="w-full border-b-2 border-black/70">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">
          <Link to="/resources" className="inline-block font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors">
            ← Back to Resources
          </Link>
          
          <h1 className="font-fraunces font-black text-black text-4xl md:text-6xl tracking-tight leading-none mb-6">
            {title}
          </h1>
          
          {formattedDate && (
            <span className="block text-xs font-mono text-gray-500 uppercase tracking-widest">
              {author ? `By ${author} • ` : ''}Published on {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 mt-10">
        
        {/* Cover Image */}
        {displayImageUrl && (
          <div className="w-full mb-10 overflow-hidden border border-black/10">
            <img
              src={displayImageUrl}
              alt={title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Portable Text Content */}
        <main className="text-gray-800 text-base md:text-lg font-mono leading-relaxed prose prose-stone max-w-none">
          {content ? (
            <PortableText value={content} components={portableTextComponents} />
          ) : (
            <p className="italic text-gray-500">No content available.</p>
          )}
        </main>

        {/* External Article CTA */}
        {originalSourceUrl && (
          <div className="mt-14 pt-10 border-t border-black/10 flex flex-col items-center">
            <h3 className="font-fraunces font-black text-2xl text-black mb-6 text-center">
              Enjoying this preview?
            </h3>
            <a
              href={originalSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 hover:bg-cobalt transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_#2563eb]"
            >
              Continue Reading on {originalSourceName || 'Original Source'} →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
