import React from 'react';

function ReleaseCard({ release }) {
  const {
    songTitle = 'Untitled',
    artistName = 'Unknown Artist',
    albumOrEpName = '',
    albumArtUrl = null,
    spotifyUrl = '#',
    releaseDate = null,
  } = release || {};

  const hasAlbum = albumOrEpName && albumOrEpName.trim();

  const releaseDateFormatted = releaseDate
    ? new Date(releaseDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(spotifyUrl, '_blank');
  };

  return (
    <div className="group">
      <div className="relative aspect-square bg-gray-300 overflow-hidden">
        {albumArtUrl ? (
          <img
            src={albumArtUrl}
            alt={`${songTitle} by ${artistName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-[10px] font-mono uppercase tracking-widest">
              No artwork
            </span>
          </div>
        )}

        {/* Play button — always visible on mobile, hover-reveal on desktop */}
        <button
          onClick={handlePlay}
          aria-label={`Play ${songTitle} on Spotify`}
          className="absolute bottom-2 right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-md
                     opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
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
            {hasAlbum ? `From the album '${albumOrEpName}'` : 'A single'}
          </p>
          {releaseDateFormatted && (
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-snug">
              Released {releaseDateFormatted}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Releases({ releases = [] }) {
  return (
    <section className="bg-[#e8e2d9] w-full py-12 md:py-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <h2 className="text-2xl md:text-3xl font-fraunces font-black tracking-tight text-black mb-8">
          New Releases
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {releases.slice(0, 6).map((release, i) => (
            <ReleaseCard key={release._id || i} release={release} />
          ))}
        </div>

      </div>
    </section>
  );
}