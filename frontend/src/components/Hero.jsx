import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero({ spotlightArtist, isLoading }) {
  if (isLoading) return <div className="h-[60vh] bg-[#e8e2d9]" />;

  const {
    artistName = 'Stella Donnelly',
    teaser = 'Phasellus fermentum malesuada phasellus netus dictum aenean placerat egestas amet.',
    imageUrl = null,
    slug = 'stella-donnelly',
  } = spotlightArtist || {};

  const spotlightLink = `/spotlight`;

  return (
    <section className="w-full bg-[#e8e2d9] border-b-2 border-black/70">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

          {/* LEFT — Artist image, links to Spotlight post */}
          <Link
            to={spotlightLink}
            className="group relative w-full md:w-[45%] flex-shrink-0 block"
          >
            <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2 py-1">
              Featured New Release
            </span>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={artistName}
                className="w-full aspect-[4/3] aspect-square transition-opacity duration-200 group-hover:opacity-80"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-[11px] font-mono uppercase tracking-widest">
                  Image coming soon
                </span>
              </div>
            )}

            {/* Hover overlay hinting at click-through */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
              <span className="text-white text-[11px] font-mono font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read the Spotlight →
              </span>
            </div>
          </Link>

          {/* RIGHT — Text content */}
          <div className="flex-1 flex flex-col gap-5 md:gap-6">

            {/* Label, aligned to top of image */}
            <span className="block text-sm md:text-base font-mono font-black uppercase tracking-[0.25em] text-black/70 pt-1">
              New Release Artist
            </span>

            <div>
              <h2 className="font-fraunces font-black tracking-tight leading-none text-black text-3xl md:text-5xl">
                {artistName}
              </h2>
            </div>

            <p className="text-gray-600 text-sm md:text-base font-mono leading-relaxed max-w-lg">
              {teaser}
            </p>

            <div>
              <Link
                to={spotlightLink}
                className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 hover:bg-gray-800 transition-all border border-black"
              >
                Artist Spotlight
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}