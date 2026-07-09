import { useState, useEffect } from 'react';
import { client } from '../client'; 
import { Link } from 'react-router-dom';

// ── Read Time Calculator ──────────────────────────────────
function calcReadTime(body) {
  if (!body) return null;
  const text = body
    .filter(block => block._type === 'block')
    .map(block => block.children?.map(child => child.text).join(''))
    .join(' ');
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 220);
}

export default function DeepDiveGrid() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...4]{
      _id,
      title,
      excerpt,
      publishedAt,
      tags,
      body,
      "slug": slug.current
    }`).then((data) => setPosts(data || []));
  }, []);

  return (
    <section className="bg-[#111318] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="flex justify-between items-baseline mb-12 border-b border-white/10 pb-6">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
            Deep Dives - <span className="text-[#00f5cc]">Long Form</span>
          </h2>
          <p className="text-white text-[11px] font-bold uppercase tracking-widest max-w-[200px] text-right">
            Deep dives into the gaps between public narratives and capital movements.
          </p>
        </div>

        {/* Article Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {posts.length > 0 ? posts.map((post) => {
            const readTime = calcReadTime(post.body);
            return (
              <Link
                key={post._id}
                to={`/article/${post.slug}`}
                className="group block p-10 border border-white/10 hover:bg-white/5 transition-colors"
              >
                {/* Tags Row */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[#00f5cc] text-[10px] font-bold uppercase tracking-widest border border-[#00f5cc]/30 px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#00f5cc] transition-colors leading-tight tracking-tighter">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-base leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer: Date + Read Time */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {readTime && (
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest font-mono">
                      {readTime} MIN READ
                    </span>
                  )}
                </div>

              </Link>
            );
          }) : (
            <p className="text-gray-600 italic p-10">Loading deep dives...</p>
          )}
        </div>

      </div>
    </section>
  );
}