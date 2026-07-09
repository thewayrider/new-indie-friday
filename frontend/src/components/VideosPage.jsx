// frontend/src/components/VideosPage.jsx

import { useEffect, useState } from 'react';
import { client } from '../client';
import VideoModal from './VideoModal';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    client.fetch(
      `*[_type == "videoShort"] | order(publishedAt desc){
        _id, title, videoUrl, publishedAt,
        "imageUrl": mainImage.asset->url
      }`
    ).then((data) => {
      setVideos(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#e7e1d7] flex items-center justify-center">
      <div className="text-[#1a1816]/30 font-manrope text-sm uppercase tracking-widest">Loading…</div>
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
          Video <span className="text-investigation">Intel</span>
        </h1>
        <p className="font-manrope text-[#1a1816]/50 text-sm mt-4 max-w-xl leading-relaxed">
          Short-form analysis and commentary. Every video starts with a signal.
        </p>
      </div>

      {/* ── Videos Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              <div className="aspect-video bg-[#d4cfc8] relative overflow-hidden border border-[#1a1816]/10 shadow-md">
                {video.imageUrl ? (
                  <img
                    src={video.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    alt={video.title}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#1a1816]/30 uppercase tracking-tighter">
                    No Preview
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-12 h-12 border border-white/70 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="pt-3">
                <h3 className="text-sm font-fraunces font-black tracking-tight text-[#1a1816] group-hover:text-investigation transition-colors leading-snug">
                  {video.title}
                </h3>
                {video.publishedAt && (
                  <span className="text-[#1a1816]/40 text-[10px] uppercase tracking-widest font-manrope mt-1 block">
                    {new Date(video.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video Modal ── */}
      {activeVideo && (
        <VideoModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}

    </div>
  );
}