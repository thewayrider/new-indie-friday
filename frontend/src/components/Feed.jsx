import React from 'react';
import { Link } from 'react-router-dom';

const Feed = ({ articleData }) => {
  return (
    <section className="bg-[#e7e1d7] w-full py-24 border-t border-[#c5bfb5]">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-2 border-[#c5bfb5] pb-8">
          <div className="space-y-2">
            <span className="text-investigation text-[12px] font-mono font-black tracking-[0.3em] uppercase">
              Archive_Type: Long_Form
            </span>
            <h2 className="text-[#1a1a1a] text-4xl md:text-5xl font-fraunces font-black tracking-tighter">
              Deep Dives.
            </h2>
          </div>
          <div className="text-[#6b6560] font-mono text-[12px] uppercase tracking-widest pb-2">
            Total_Records: {articleData.length || '00'} // Classification: Public
          </div>
        </div>

        {/* The Dossier List */}
        <div className="grid grid-cols-1 gap-0">
          {articleData.slice(0, 6).map((article, index) => (
            <Link
              key={article._id}
              to={`/article/${article.slug}`}
              className="group flex flex-col md:flex-row gap-12 py-12 border-b border-[#c5bfb5] hover:bg-[#ddd8ce] transition-colors first:pt-0"
            >
              <div className="hidden md:block font-mono text-[12px] font-bold text-[#b8b2a8] pt-2">
                0{index + 1}
              </div>

              {article.imageUrl && (
                <div className="w-full md:w-[320px] aspect-[16/9] bg-[#d4cfc8] overflow-hidden flex-shrink-0 border border-[#c5bfb5]">
                  <img
                    src={article.imageUrl}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
                    alt={article.title}
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[11px] font-mono font-black bg-[#1a1a1a] text-white px-2 py-0.5 tracking-widest uppercase">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="h-[1px] flex-1 bg-[#c5bfb5]"></span>
                </div>

                <h3 className="text-2xl md:text-4xl font-fraunces font-black leading-tight text-[#1a1a1a] group-hover:text-investigation transition-colors tracking-tight mb-4">
                  {article.title}
                </h3>
                
                <p className="text-[#6b6560] font-manrope text-base leading-relaxed max-w-2xl line-clamp-2">
                  {article.excerpt || "Establishing the baseline for this investigation. Click to access the full dossier and evidence."}
                </p>

                <div className="mt-8 flex items-center gap-2">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-[#1a1a1a] font-black font-mono border-b border-[#1a1a1a] pb-0.5">
                    Open File
                  </span>
                  <span className="text-investigation group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feed;