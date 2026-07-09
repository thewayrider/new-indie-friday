// frontend/src/components/SideDivesPage.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../client';

export default function SideDivesPage() {
  const [dives, setDives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(
      `*[_type == "sideDive" && archived != true] | order(publishedAt desc){
        _id, title, excerpt, publishedAt, tags, readTime,
        "slug": slug.current,
        "imageUrl": mainImage.asset->url
      }`
    ).then((data) => {
      setDives(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
      <div className="text-black/20 font-manrope text-sm uppercase tracking-widest">Loading…</div>
    </div>
  );

  return (
    <div className="bg-[#e8e2d9] min-h-screen">

      {/* ── Page Header ── */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 border-b border-black/10">
        <span className="text-investigation text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
          The Double Take
        </span>
        <h1 className="text-5xl md:text-6xl font-fraunces font-black text-black tracking-tighter">
          Side Dives — <span className="text-investigation">The Other Stories</span>
        </h1>
        <p className="font-manrope text-black/70 text-sm mt-4 max-w-xl leading-relaxed">
          Sharper angles, and other observations.
        </p>
      </div>

      {/* ── Articles List ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10">
          {dives.length === 0 && (
            <p className="text-black/30 font-mono text-sm uppercase tracking-widest">
              No Side Dives published yet.
            </p>
          )}
          {dives.map((dive) => (
            <Link
              key={dive._id}
              to={`/side-dive/${dive.slug}`}
              className="flex flex-col md:flex-row gap-6 group border-b border-black/10 pb-10 last:border-0"
            >
              {dive.imageUrl && (
                <div className="w-full md:w-[280px] aspect-video bg-black/5 overflow-hidden flex-shrink-0">
                  <img
                    src={dive.imageUrl}
                    className="w-full h-full object-contain bg-[#e8e2d9] opacity-90 group-hover:opacity-100 transition-all duration-700"
                    alt={dive.title}
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center">
                {dive.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dive.tags.map(tag => (
                      <span key={tag}
                        className="bg-investigation text-white text-[9px] font-black uppercase tracking-[0.25em] px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-fraunces font-black leading-tight text-black group-hover:text-investigation transition-colors tracking-tighter mb-3">
                  {dive.title}
                </h2>
                {dive.excerpt && (
                  <p className="text-black/50 text-sm max-w-2xl line-clamp-2 font-light tracking-wide mb-5">
                    {dive.excerpt}
                  </p>
                )}
                {dive.publishedAt && (
                  <span className="text-black/30 text-[10px] uppercase tracking-widest font-manrope mb-5">
                    {new Date(dive.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                )}
                {dive.readTime && (
                  <span className="text-black/30 text-[10px] uppercase tracking-widest font-mono mb-5">
                    {dive.readTime} min read
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-investigation" />
                  <span className="text-[10px] uppercase tracking-widest text-investigation font-black font-mono">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}