import React from 'react';
import { Link } from 'react-router-dom';

function ReleaseCard({ release }) {
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

  // Format-word label (uppercased by CSS). Falls back to legacy wording for
  // records not yet given a releaseType in Studio.
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
    <Link
      to={'/new-releases/' + slug}
      className="group block"
    >
      <div className="relative aspect-square bg-gray-300 overflow-hidden">
        {albumArtUrl ? (
          <img
            src={albumArtUrl}
            alt={songTitle + ' by ' + artistName}
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">
              No artwork
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-blue-950/0 group-hover:bg-blue-950/30 transition-colors duration-200">
          <span className="text-white text-[11px] font-mono font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Comments & Spotify Play Link →
          </span>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="text-sm font-bold text-black group-hover:text-cobalt transition-colors leading-snug truncate">
          {songTitle}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {artistName}
        </p>
        <div className="mt-1 min-h-[2.4em]">
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-snug">
            {typeLine}
          </p>
          {releaseDateFormatted && (
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-snug">
              Released {releaseDateFormatted}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Releases({ releases = [], homePage = null }) {
  const [activeTab, setActiveTab] = React.useState('releases');
  const spotifyUrl = homePage?.spotifyPlaylistUrl;
  const curatorTitle = homePage?.curatorSelectionTitle || "Curator's Selections";

  React.useEffect(() => {
    const handleReset = () => {
      setActiveTab('releases');
    };
    window.addEventListener('reset-releases-tab', handleReset);
    return () => {
      window.removeEventListener('reset-releases-tab', handleReset);
    };
  }, []);

  const getSpotifyEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'open.spotify.com') {
        const path = parsedUrl.pathname; 
        return `https://open.spotify.com/embed${path}?utm_source=generator`;
      }
      return url;
    } catch(e) {
      return url;
    }
  };

  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  return (
    <section className="bg-[#e8e2d9] w-full py-12 md:py-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header and Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-black/15">
          <div>
            <span className="block text-[10px] md:text-[11px] font-mono font-black uppercase tracking-[0.25em] text-black/60 mb-1">
              {activeTab === 'releases' ? 'Curated Weekly Selections' : 'Candidate Discovery Pool'}
            </span>
            <h2 className="text-2xl md:text-4xl font-fraunces font-black tracking-tight text-black flex items-center gap-2.5">
              <span>{activeTab === 'releases' ? 'New Releases' : curatorTitle}</span>
              {activeTab === 'releases' && (
                <img 
                  src="/headphones.png" 
                  alt="" 
                  aria-hidden="true" 
                  className="inline-block w-5 h-5 md:w-7 md:h-7 object-contain opacity-90 select-none"
                />
              )}
            </h2>
          </div>

          {embedUrl && (
            <div 
              className="inline-flex p-1.5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#2563eb] gap-1.5 self-start md:self-auto"
              role="tablist"
              aria-label="Release views"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'releases'}
                onClick={() => setActiveTab('releases')}
                className={`px-4 py-2.5 text-xs font-mono font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                  activeTab === 'releases'
                    ? 'bg-black text-white shadow-none'
                    : 'bg-transparent text-black hover:bg-black/5 hover:text-cobalt'
                }`}
              >
                <span>Weekly Picks</span>
                {releases.length > 0 && (
                  <span 
                    className={`px-1.5 py-0.5 text-[10px] font-mono font-black leading-none ${
                      activeTab === 'releases' 
                        ? 'bg-cobalt text-white' 
                        : 'bg-black text-white'
                    }`}
                  >
                    {releases.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'curator'}
                onClick={() => setActiveTab('curator')}
                className={`px-4 py-2.5 text-xs font-mono font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 ${
                  activeTab === 'curator'
                    ? 'bg-black text-white shadow-none'
                    : 'bg-transparent text-black hover:bg-black/5 hover:text-cobalt'
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  {activeTab === 'curator' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75"></span>
                  )}
                  <span 
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      activeTab === 'curator' ? 'bg-cobalt' : 'bg-gray-400'
                    }`} 
                  />
                </span>
                <span>{curatorTitle}</span>
                <span 
                  className={`text-[9px] font-mono font-black tracking-widest px-1.5 py-0.5 uppercase leading-none ${
                    activeTab === 'curator' 
                      ? 'bg-white text-black' 
                      : 'bg-black/10 text-black/70'
                  }`}
                >
                  Stream
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Curated Releases Grid */}
        {activeTab === 'releases' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {releases.slice(0, 12).map(function (release, i) {
                return (
                  <ReleaseCard key={release._id || i} release={release} />
                );
              })}
            </div>

            {releases.length === 0 && (
              <p className="text-center text-sm font-mono text-gray-500 py-12">
                No releases available at this time.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Live Curator's Candidate Pool (Spotify Embed) */}
        {activeTab === 'curator' && embedUrl && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 border-l-4 border-l-cobalt border border-black/15 p-6 md:p-8 mb-8 backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cobalt animate-pulse" />
                <span className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-black">
                  Live Listening Stream
                </span>
              </div>
              <p className="text-sm md:text-base font-mono text-gray-700 leading-relaxed">
                This playlist represents our raw weekly candidate pool—updated continuously as new indie music drops. We listen through these tracks all week before narrowing them down to our featured New Releases.
              </p>
            </div>

            <div className="shadow-2xl overflow-hidden border border-black/20 rounded-xl bg-black">
              <iframe 
                src={embedUrl}
                width="100%" 
                height="650" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title={curatorTitle}
                className="w-full"
              ></iframe>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}