import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_AUDITION_POOL, MOCK_EXTRAS } from './mockData';

function ExplainerModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#e8e2d9] border-2 border-black p-6 md:p-8 max-w-2xl w-full rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-cobalt font-bold text-xl">&times;</button>
        <h3 className="text-2xl font-fraunces font-black mb-6">The 4-Stage Curation Process</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-cobalt text-white flex items-center justify-center font-bold rounded-full border-2 border-black">1</div>
            <div>
              <h4 className="font-bold text-lg">Discovery</h4>
              <p className="text-sm text-gray-700">Autonomous AI agents and Streamusique monitor regional tastemakers, blogs, and charts across AU/NZ and worldwide to cast a wide new releases net.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-yellow-400 text-black flex items-center justify-center font-bold rounded-full border-2 border-black">2</div>
            <div>
              <h4 className="font-bold text-lg">The Audition Pool</h4>
              <p className="text-sm text-gray-700">The shortlist. These are the tracks that stood out from the raw feed and are brought in for extended listening.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-orange-500 text-white flex items-center justify-center font-bold rounded-full border-2 border-black">3</div>
            <div>
              <h4 className="font-bold text-lg">The Curated Cut</h4>
              <p className="text-sm text-gray-700">The final filter. The curated tracks make it to the front of the 'Audition Pool' section on the front page.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-black text-white flex items-center justify-center font-bold rounded-full border-2 border-black">4</div>
            <div>
              <h4 className="font-bold text-lg">New Releases</h4>
              <p className="text-sm text-gray-700">One track is chosen each time for inclusion on the front page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReleaseCard({ release, extra }) {
  const {
    songTitle = 'Untitled',
    artistName = 'Unknown Artist',
    releaseType = '',
    albumOrEpName = '',
    albumArtUrl = null,
    releaseDate = null,
    slug = '',
  } = release || {};

  const hasAlbum = albumOrEpName && albumOrEpName.trim();

  const typeLine =
    releaseType === 'album'
      ? "Album · " + albumOrEpName
      : releaseType === 'ep'
      ? "EP · " + albumOrEpName
      : releaseType === 'single'
      ? 'Single'
      : hasAlbum
      ? "Album · " + albumOrEpName
      : 'Single';

  const releaseDateFormatted = releaseDate
    ? new Date(releaseDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="group block flex flex-col h-full">
      <Link to={'/new-releases/' + slug} className="block relative aspect-square bg-gray-300 overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {albumArtUrl ? (
          <img
            src={albumArtUrl}
            alt={songTitle + ' by ' + artistName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">
              Vinyl Placeholder
            </span>
          </div>
        )}
        
        {/* View Release Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <div className="bg-black/70 px-5 py-2.5 flex items-center justify-center gap-2.5 text-white transform scale-95 group-hover:scale-100 transition-transform duration-300">
             <img src="/headphones.png" alt="Headphones" aria-hidden="true" className="w-4 h-4 object-contain select-none invert" />
             <span className="font-bold uppercase tracking-[0.2em] text-[11px]">View Release</span>
           </div>
        </div>
        

      </Link>

      <div className="pt-4 flex-grow flex flex-col">
        <Link to={'/new-releases/' + slug}>
          <h3 className="text-lg font-black text-black group-hover:text-cobalt transition-colors leading-tight line-clamp-2">
            {songTitle}
          </h3>
          <p className="text-sm font-bold text-gray-700 mt-1 truncate">
            {artistName}
          </p>
        </Link>
        <div className="mt-2 mb-3">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-snug">
            {typeLine} {releaseDateFormatted && `• ${releaseDateFormatted}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Releases({ releases = [], homePage = null }) {
  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'pool'
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const curatedReleases = releases.slice(0, 6);

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "The Curated Cut - New Indie Friday",
    "description": "The top 6 exclusive indie music selections meticulously curated this week.",
    "itemListElement": curatedReleases.map((release, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "MusicRecording",
        "name": release.songTitle,
        "byArtist": {
          "@type": "MusicGroup",
          "name": release.artistName
        },
        "url": `https://newindiefriday.com/new-releases/${release.slug}`,
        "image": release.albumArtUrl,
        "countryOfOrigin": MOCK_EXTRAS[index % MOCK_EXTRAS.length]?.region?.replace('📍 ', '') || 'Australia'
      }
    }))
  };

  return (
    <section className="bg-[#e8e2d9] w-full py-12 md:py-16 border-t border-black/10">
      {/* Inject JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <ExplainerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Integrated Section Header & Curation Process */}
        <div className="flex flex-col gap-5 mb-8 pb-4 border-b-2 border-black">
          
          {/* Slim Editorial Process Bar */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-3 text-xs md:text-sm font-mono text-gray-800 pb-4 border-b border-black/10">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-center px-4 md:px-32">
              <span className="font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cobalt shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" fill="currentColor" />
                  <circle cx="18" cy="16" r="3" fill="currentColor" />
                </svg>
                New Music Discovery:
              </span>
              <span className="flex items-center gap-1.5 font-bold text-gray-900">
                <svg className="w-3.5 h-3.5 text-cobalt shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Weekly Song Pool
              </span>
              <span className="text-black font-black">➔</span>
              <span className="font-bold text-gray-900">Selected Tracks</span>
              <span className="text-black font-black">➔</span>
              <span className="flex items-center gap-1.5 font-bold text-gray-900">
                <svg className="w-3.5 h-3.5 text-cobalt shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                New Release
              </span>
            </div>

            <div className="md:absolute md:right-0 md:w-[300px] flex justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 bg-transparent text-black text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 hover:bg-white hover:text-black transition-all border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px]"
              >
                How it works →
              </button>
            </div>
          </div>

          {/* Main Title & Tabs Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="block text-[10px] md:text-[11px] font-mono font-black uppercase tracking-[0.25em] text-black/60 mb-1">
                Curated Weekly Selections
              </span>
              <h2 className="text-2xl md:text-4xl font-fraunces font-black tracking-tight text-black flex items-center gap-2.5">
                <span>New Releases</span>
                <img 
                  src="/headphones.png" 
                  alt="" 
                  aria-hidden="true" 
                  className="inline-block w-5 h-5 md:w-7 md:h-7 object-contain opacity-90 select-none"
                />
              </h2>
            </div>
            
            <div className="w-full sm:w-[300px] flex bg-white border-2 border-black p-1 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <button 
                onClick={() => setActiveTab('curated')}
                className={`flex-1 py-1.5 px-3 text-center rounded-full text-xs md:text-[13px] font-bold transition-colors ${activeTab === 'curated' ? 'bg-neutral-800 text-white' : 'bg-transparent text-gray-700 hover:text-black hover:bg-gray-100'}`}
              >
                New Releases
              </button>
              <button 
                onClick={() => setActiveTab('pool')}
                className={`flex-1 py-1.5 px-3 text-center rounded-full text-xs md:text-[13px] font-bold transition-colors ${activeTab === 'pool' ? 'bg-neutral-800 text-white' : 'bg-transparent text-gray-700 hover:text-black hover:bg-gray-100'}`}
              >
                Weekly Song Pool
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: The Curated Cut */}
        {activeTab === 'curated' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {curatedReleases.map(function (release, i) {
                return (
                  <ReleaseCard key={release._id || i} release={release} extra={MOCK_EXTRAS[i % MOCK_EXTRAS.length]} />
                );
              })}
            </div>

            {curatedReleases.length === 0 && (
              <p className="text-center text-sm font-mono text-gray-500 py-12">
                No releases available at this time.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: The Audition Pool */}
        {activeTab === 'pool' && (
          <div className="w-full">
            <iframe 
              data-testid="embed-iframe" 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/playlist/07mpfeaseGbIdKBvQPwwEd?utm_source=generator&si=e3ceb2d91ba4442d" 
              width="100%" 
              height="950" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="The Audition Pool"
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
}