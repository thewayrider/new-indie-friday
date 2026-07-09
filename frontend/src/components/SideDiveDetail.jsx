import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { client } from '../client';
import { PortableText } from '@portabletext/react';
import DisqusComments from './DisqusComments';


// ── Reading Progress Bar ──
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('.prose-sidedive');
      if (!article) return;
      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, Math.min(100, ((windowHeight - top) / (height + windowHeight)) * 100));
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] bg-[#1a1816]/10">
      <div
        className="h-full bg-investigation transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};


const ptComponents = {
  types: {
    videoEmbed: ({ value }) => {
      if (!value?.url) return null;
      const embedUrl = value.url
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'www.youtube.com/embed/')
        .replace('vimeo.com/', 'player.vimeo.com/video/');
      return (
        <div className="my-8">
          <div className="relative w-full aspect-video bg-black/10">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={value.caption || 'Embedded video'}
            />
          </div>
          {value.caption && (
            <p className="text-black/40 text-[10px] font-mono uppercase tracking-widest mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p style={{ color: 'rgba(0,0,0,0.75)' }} className="text-base md:text-lg font-manrope leading-relaxed mb-6 max-w-[68ch]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 style={{ color: '#1a1a1a' }} className="text-2xl md:text-3xl font-fraunces font-black tracking-tighter mt-12 mb-4 max-w-[68ch]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ color: '#1a1a1a' }} className="text-xl font-fraunces font-black tracking-tighter mt-8 mb-3 max-w-[68ch]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ color: '#1a1a1a' }} className="text-lg font-fraunces font-black tracking-tighter mt-6 mb-2 max-w-[68ch]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-investigation pl-6 my-8 max-w-[60ch]">
        <p style={{ color: 'rgba(0,0,0,0.65)' }} className="text-xl md:text-2xl font-fraunces italic leading-snug">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ color: '#1a1a1a' }} className="font-black">{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ color: 'rgba(0,0,0,0.7)' }} className="italic">{children}</em>
    ),
    link: ({ value, children }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer"
        className="text-investigation underline underline-offset-4 hover:text-black transition-colors">
        {children}
      </a>
    ),
  },
};


export default function SideDiveDetail() {
  const { slug } = useParams();
  const [dive, setDive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type == "sideDive" && slug.current == $slug][0]{
      title, excerpt, publishedAt, readTime, tags,
      body,
      "imageUrl": mainImage.asset->url,
      seo { metaTitle, metaDescription }
    }`;
    client.fetch(query, { slug }).then((res) => {
      setDive(res);
      setLoading(false);
    }).catch(err => {
      console.error('SideDiveDetail fetch error:', err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
      <span className="font-mono text-[10px] tracking-[0.3em] text-black/30 uppercase animate-pulse">
        Loading...
      </span>
    </div>
  );

  if (!dive) return (
    <div className="min-h-screen bg-[#e8e2d9] flex flex-col items-center justify-center gap-6">
      <span className="font-mono text-[10px] tracking-[0.3em] text-investigation uppercase">
        404 // Not Found
      </span>
      <p className="font-fraunces text-black text-3xl font-black">Article not found.</p>
      <NavLink to="/side-dives" className="text-[10px] font-mono tracking-[0.3em] text-black/40 hover:text-black transition-colors uppercase">
        ← Back to Side Dives
      </NavLink>
    </div>
  );

  const date = dive.publishedAt
    ? new Date(dive.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null;

  return (
    <article className="bg-[#e8e2d9] min-h-screen">

      {/* ── Reading Progress Bar ── */}
      <ReadingProgress />

      <div className="w-full bg-[#e8e2d9] border-b border-black/10 py-3 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="bg-investigation text-white text-[9px] font-mono font-black tracking-[0.2em] px-2 py-1 uppercase">
            SIDE_DIVE
          </span>
          {dive.tags?.length > 0 && dive.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono font-black tracking-[0.2em] text-investigation border border-investigation/30 px-2 py-1 uppercase">
              {tag}
            </span>
          ))}
        </div>
        <span className="hidden md:block font-mono text-[9px] text-black/20 tracking-[0.2em] uppercase">
          kimrampling.com
        </span>
      </div>

      <div className="max-w-[780px] mx-auto px-6 md:px-12 pt-16 pb-8">

        <div className="flex flex-col md:flex-row md:items-start md:gap-10 mb-6">
          <div className="flex-1">
            <h1 style={{ color: '#1a1a1a' }} className="text-4xl md:text-5xl font-fraunces font-black tracking-tighter leading-none mb-6">
              {dive.title}
            </h1>
            {dive.excerpt && (
              <p style={{ color: 'rgba(0,0,0,0.55)' }} className="text-lg font-manrope leading-relaxed max-w-[52ch] border-l-2 border-black/10 pl-4">
                {dive.excerpt}
              </p>
            )}
          </div>
          {dive.imageUrl && (
            <div className="w-full md:w-[260px] flex-shrink-0 mt-6 md:mt-0">
              <div className="aspect-[4/3] overflow-hidden border border-black/10 bg-[#e8e2d9]">
                <img
                  src={dive.imageUrl}
                  alt={dive.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-black/10 mb-12">
          <div>
            <span className="text-[9px] font-mono tracking-[0.2em] text-black/30 uppercase block mb-1">Author</span>
            <span style={{ color: '#1a1a1a' }} className="text-sm font-manrope font-bold">Kim Robert Rampling</span>
          </div>
          {date && (
            <div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-black/30 uppercase block mb-1">Published</span>
              <span style={{ color: '#1a1a1a' }} className="text-sm font-manrope">{date}</span>
            </div>
          )}
          {dive.readTime && (
            <div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-black/30 uppercase block mb-1">Read Time</span>
              <span style={{ color: '#1a1a1a' }} className="text-sm font-manrope">{dive.readTime} min</span>
            </div>
          )}
        </div>

        {dive.body && (
          <div className="prose-sidedive" style={{ color: '#1a1a1a' }}>
            <PortableText value={dive.body} components={ptComponents} />
          </div>
        )}

        <DisqusComments
          pageId={`sidedive-${slug}`}
          pageUrl={`https://kimrampling.com/side-dive/${slug}`}
          pageTitle={dive.title}
        />

        <div className="mt-16 pt-8 border-t border-black/10">
          <NavLink to="/side-dives" className="text-[10px] font-mono font-black tracking-[0.3em] text-black/40 hover:text-black transition-colors uppercase">
            ← Back to Side Dives
          </NavLink>
        </div>

      </div>
    </article>
  );
}