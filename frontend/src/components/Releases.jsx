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
              <h4 className="font-bold text-lg">Discovery (160+ Tracks)</h4>
              <p className="text-sm text-gray-700">Autonomous AI agents and human scouts monitor regional tastemakers, blogs, and charts across AU/NZ and worldwide to cast a wide new releases net.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-yellow-400 text-black flex items-center justify-center font-bold rounded-full border-2 border-black">2</div>
            <div>
              <h4 className="font-bold text-lg">The Audition Pool (~33 Tracks)</h4>
              <p className="text-sm text-gray-700">The shortlist. These are the tracks that stood out from the raw feed and are brought in for deep listening sessions.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-orange-500 text-white flex items-center justify-center font-bold rounded-full border-2 border-black">3</div>
            <div>
              <h4 className="font-bold text-lg">The Curated Cut (6 Tracks)</h4>
              <p className="text-sm text-gray-700">The brutal final filter. Only the absolute best tracks make it to the front page every Friday.</p>
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
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           <div className="w-16 h-16 bg-cobalt rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white text-white hover:text-black transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-1" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
             </svg>
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
        
        {/* Top Curation Metric Bar */}
        <div className="mb-10 w-full bg-white/60 backdrop-blur-md text-black p-4 md:p-6 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:flex md:items-center md:justify-between border-2 border-black">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-0">
            <div className="text-sm font-mono font-black text-black uppercase tracking-widest">Curation Funnel:</div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-gray-800">
              <span className="flex items-center gap-1"><span className="text-lg">📡</span> 160+ Scouted</span>
              <span className="text-black font-black">➔</span>
              <span className="flex items-center gap-1"><span className="text-lg">🎧</span> 33 Audition Pool</span>
              <span className="text-black font-black">➔</span>
              <span className="flex items-center gap-1.5 text-black font-bold bg-white px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <img src="/headphones.png" alt="" aria-hidden="true" className="w-5 h-5 object-contain select-none" />
                6 The Curated Releases
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-cobalt transition-colors border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-y-[3px] hover:translate-x-[3px]"
          >
            How it works →
          </button>
        </div>

        {/* Dual-View Switcher Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b-2 border-black">
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
          
          <div className="flex bg-white border-2 border-black p-1 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button 
              onClick={() => setActiveTab('curated')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'curated' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-200'}`}
            >
              The Curated Cut
            </button>
            <button 
              onClick={() => setActiveTab('pool')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${activeTab === 'pool' ? 'bg-black text-white' : 'bg-transparent text-black hover:bg-gray-200'}`}
            >
              The Audition Pool
            </button>
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