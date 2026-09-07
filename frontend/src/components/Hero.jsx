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
      <div className="w-full px-6 md:px-12 py-10 md:py-14 flex flex-col lg:flex-row gap-8 lg:gap-0">
        
        {/* LEFT SIDE (Spotlight Feature) */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-12 items-start lg:pr-12 lg:pl-6">
          
          {/* Artist image, links to Spotlight post */}
          <Link
            to={spotlightLink}
            className="group relative w-full md:w-[45%] lg:w-[40%] flex-shrink-0 block"
          >
            <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2 py-1 border-l-2 border-cobalt">
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

          {/* Text content */}
          <div className="flex-1 flex flex-col gap-5 md:gap-6">
            
            {/* Label, aligned to top of image */}
            <div className="flex items-center gap-2.5 pt-1">
              <img 
                src="/headphones.png" 
                alt="" 
                aria-hidden="true" 
                className="w-4 h-4 md:w-5 md:h-5 object-contain opacity-90 select-none"
              />
              <span className="text-base md:text-lg font-mono font-black uppercase tracking-[0.25em] text-black/80">
                New Release Artist
              </span>
            </div>

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
                className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 hover:bg-cobalt hover:border-cobalt transition-all border border-black shadow-[3px_3px_0px_0px_#2563eb]"
              >
                Artist Spotlight
              </Link>
            </div>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="hidden lg:block w-[2px] bg-black/70 my-8"></div>
        <div className="lg:hidden h-[2px] w-full bg-black/70 my-2"></div>

        {/* RIGHT SIDE (Doobie Brothers) */}
        <div className="lg:w-[320px] xl:w-[400px] flex-shrink-0 lg:pl-12 flex flex-col justify-center gap-8">
          <p className="font-fraunces text-base lg:text-lg italic leading-relaxed text-black/90">
            "Don't you feel it growing, day by day<br/>
            People getting ready for the news<br/>
            Some are happy, some are sad<br/>
            Oh, we got to let the music play"
          </p>
          
          <div className="flex items-center gap-5">
            <img 
              src="/doobie-brothers-toulouse-street.png" 
              alt="Doobie Brothers - Toulouse Street" 
              className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-black/70 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            <div className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-black">
              <a 
                href="https://open.spotify.com/track/7Ar4G7Ci11gpt6sfH9Cgz5?si=6232a0844d0f4d10" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cobalt underline decoration-2 underline-offset-4 transition-colors leading-tight inline-block mb-1"
              >
                Listen to the Music
              </a>
              <br/>
              <span className="text-black/60 text-[9px] md:text-[10px]">
                - The Doobie Brothers
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}