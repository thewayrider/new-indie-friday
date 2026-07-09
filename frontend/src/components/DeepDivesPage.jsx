// frontend/src/components/DeepDivesPage.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../client';

export default function DeepDivesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(
     `*[_type == "article" && archived != true] | order(publishedAt desc){
        _id, title, excerpt, publishedAt,
        "imageUrl": mainImage.asset->url,
        "slug": slug.current,
        tags
      }`
    ).then((data) => {
      setArticles(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#e7e1d7] flex items-center justify-center">
      <div className="text-[#e7e1d7]/30 font-manrope text-sm uppercase tracking-widest">Loading…</div>
    </div>
  );

  return (
    <div className="bg-[#e7e1d7] min-h-screen">

     {/* ── Page Header ── */}
<div className="max-w-7xl mx-auto px-4 pt-16 pb-12 border-b border-[#1a1816]/10">
  <span className="text-investigation text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
    The Double Take
  </span>
  <h1 className="text-5xl md:text-6xl font-fraunces font-black text-[#1a1816] tracking-tighter">
    Deep Dives — <span className="text-investigation">Analysis</span>
  </h1>
  <p className="font-manrope text-[#1a1816]/50 text-sm mt-4 max-w-xl leading-relaxed">
    Every piece starts as a social media post. What you find here is what happened when I kept pulling the thread.
  </p>
</div>

      {/* ── Articles List ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10">
          {articles.map((article) => (
            <Link
              key={article._id}
              to={`/article/${article.slug}`}
              className="flex flex-col md:flex-row gap-6 group border-b border-[#e7e1d7]/8 pb-10 last:border-0"
            >
              {article.imageUrl && (
                <div className="w-full md:w-[280px] aspect-video overflow-hidden flex-shrink-0 rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                  <img
                    src={article.imageUrl}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    alt={article.title}
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center bg-[#f0ebe3] rounded-sm px-6 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-shadow duration-500">
                {article.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map(tag => (
                      <span key={tag}
                        className="bg-investigation text-white text-[9px] font-black uppercase tracking-[0.25em] px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-fraunces font-black text-[#1a1816] leading-tight group-hover:text-investigation transition-colors tracking-tighter mb-3">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-[#1a1816]/55 text-sm max-w-2xl line-clamp-2 font-light tracking-wide mb-5">
                    {article.excerpt}
                  </p>
                )}
                {article.publishedAt && (
                  <span className="text-[#1a1816]/40 text-[10px] uppercase tracking-widest font-manrope mb-5">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-investigation" />
                  <span className="text-[10px] uppercase tracking-widest text-investigation font-black font-mono">Read Analysis</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}