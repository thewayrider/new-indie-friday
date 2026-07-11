import React from 'react';
import { Link } from 'react-router-dom';

function ReleaseCard({ release }) {
  const {
    songTitle = 'Untitled',
    artistName = 'Unknown Artist',
    albumOrEpName = '',
    albumArtUrl = null,
    releaseDate = null,
    slug = '',
  } = release || {};

  const hasAlbum = albumOrEpName && albumOrEpName.trim();

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
            {hasAlbum ? 'From the album \'' + albumOrEpName + '\'' : 'A single'}
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

export default function Releases({ releases = [] }) {
  return (
    <section className="bg-[#e8e2d9] w-full py-12 md:py-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <h2 className="text-2xl md:text-3xl font-fraunces font-black tracking-tight text-black mb-8">
          This Week's Releases
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
          {releases.slice(0, 6).map(function (release, i) {
            return (
              <ReleaseCard key={release._id || i} release={release} />
            );
          })}
        </div>

      </div>
    </section>
  );
}