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
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
          <span className="text-white text-[11px] font-mono font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Comments & Spotify Play Link →
          </span>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="text-sm font-bold text-black leading-snug truncate">
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
  const spotifyUrl = homePage?.spotifyPlaylistUrl;
  const curatorTitle = homePage?.curatorSelectionTitle || "Curator's Selections";

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
  }

  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  return (
    <section className="bg-[#e8e2d9] w-full py-12 md:py-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row-reverse justify-between gap-12 lg:gap-16">
          {/* Main Grid */}
          <div className="w-full lg:w-[68%]">
            <h2 className="text-2xl md:text-3xl font-fraunces font-black tracking-tight text-black mb-8 text-center">
              New Releases
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {releases.slice(0, 9).map(function (release, i) {
                return (
                  <ReleaseCard key={release._id || i} release={release} />
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          {embedUrl && (
            <div className="w-full lg:w-[28%] shrink-0">
              <h2 className="text-2xl md:text-3xl font-fraunces font-black tracking-tight text-black mb-8">
                {curatorTitle}
              </h2>
              <div className="sticky top-8">
                <iframe 
                  style={{ borderRadius: '12px' }} 
                  src={embedUrl}
                  width="100%" 
                  height="600" 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="shadow-xl"
                ></iframe>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}