import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function getSpotifyEmbedUrl(spotifyUrl) {
  if (!spotifyUrl) return null;
  try {
    const url = new URL(spotifyUrl);
    return 'https://open.spotify.com/embed' + url.pathname;
  } catch {
    return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Hero({ spotlightArtist, latestRelease = null, homePage = null, isLoading }) {
  const [openOverlay, setOpenOverlay] = useState(null); // 'pool' | 'standouts' | null

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenOverlay(null);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) return <div className="h-[60vh] bg-[#e8e2d9]" />;

  const {
    artistName = 'Stella Donnelly',
    teaser = 'Phasellus fermentum malesuada phasellus netus dictum aenean placerat egestas amet.',
    featuredDate = null,
    imageUrl = null,
    featureCategory = 'Featured Artist',
    albumSubtitle = null,
  } = spotlightArtist || {};

  const designation = featureCategory || 'Featured Artist';
  const buttonLabel = designation.toLowerCase().includes('album') ? 'Album Spotlight' : 'Artist Spotlight';
  const spotlightLink = '/spotlight';

  const defaultSpotifyUrl =
    'https://open.spotify.com/embed/playlist/07mpfeaseGbIdKBvQPwwEd?utm_source=generator&si=e3ceb2d91ba4442d';
  const embedUrl = homePage?.spotifyPlaylistUrl
    ? getSpotifyEmbedUrl(homePage.spotifyPlaylistUrl) || defaultSpotifyUrl
    : defaultSpotifyUrl;

  const standoutSongs = homePage?.standoutSongs || [];

  return (
    <section className="relative w-full bg-[#e8e2d9] border-b border-black/15">
      <div className="w-full px-6 md:px-12 py-8 md:py-10 lg:min-h-[calc(100vh-125px)] flex flex-col justify-between gap-8">
        {/* TOP ROW: FULL HERO WIDTH — FEATURED SPOTLIGHT (7 cols) + LATEST RELEASE PICK (5 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT PROMINENCE: FEATURED ALBUM / ARTIST SPOTLIGHT (7 cols) */}
          <div className="xl:col-span-7 flex flex-col justify-start py-1">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <Link
                to={spotlightLink}
                className="group relative w-full md:w-[51%] flex-shrink-0 overflow-hidden bg-gray-200 block self-start"
              >
                <span className="absolute top-3 left-3 z-10 bg-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2 py-1 border-l-2 border-cobalt">
                  {designation}
                </span>

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={artistName}
                    className="w-full aspect-[4/3] object-cover transition-opacity duration-200 group-hover:opacity-85"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-[11px] font-mono uppercase tracking-widest">
                      Image coming soon
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-200">
                  <span className="text-white text-[11px] font-mono font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Read the Spotlight →
                  </span>
                </div>
              </Link>

              <div className="flex-1 flex flex-col justify-between gap-5 md:min-h-[260px]">
                <div>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-mono font-bold uppercase tracking-[0.22em] text-black/80 mb-2.5">
                    <img
                      src="/headphones.png"
                      alt="Headphones"
                      aria-hidden="true"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain opacity-90 select-none"
                    />
                    <span>{designation}</span>
                  </div>

                  <h2 className="font-fraunces font-black text-2xl md:text-3xl tracking-tight leading-tight text-black">
                    {artistName}
                  </h2>

                  {albumSubtitle && (
                    <p className="font-mono text-sm md:text-base font-semibold text-black/80 mt-2.5">
                      {albumSubtitle}
                    </p>
                  )}

                  <p className="font-mono text-sm md:text-base text-gray-700 leading-relaxed mt-3.5">
                    {teaser}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    to={spotlightLink}
                    className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 hover:bg-cobalt transition-all border border-black shadow-[3px_3px_0px_0px_#2563eb]"
                  >
                    {buttonLabel} →
                  </Link>
                  {featuredDate && (
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      {formatDate(featuredDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT OF TOP ROW: LATEST RELEASE PICK (5 cols) */}
          <div className="xl:col-span-5 flex flex-col justify-center py-1">
            {latestRelease ? (
              <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="relative w-full max-w-[310px] sm:w-[270px] xl:w-[300px] flex-shrink-0">
                  <span className="absolute -top-7 left-0 z-10 bg-cobalt text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2.5 py-1">
                    Latest Release Pick
                  </span>
                  <Link
                    to={`/new-releases/${latestRelease.slug}`}
                    className="group relative block w-full aspect-square bg-gray-300 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {latestRelease.albumArtUrl ? (
                      <img
                        src={latestRelease.albumArtUrl}
                        alt={`${latestRelease.songTitle} by ${latestRelease.artistName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-mono">
                        Cover Art
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-black/70 px-5 py-2.5 flex items-center justify-center gap-2.5 text-white transform scale-95 group-hover:scale-100 transition-transform duration-300">
                        <img src="/headphones.png" alt="Headphones" aria-hidden="true" className="w-4 h-4 object-contain select-none invert" />
                        <span className="font-bold uppercase tracking-[0.2em] text-[11px]">View Release</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center sm:items-start text-center sm:text-left min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-black/60 mb-1">
                    <span>{latestRelease.releaseType || 'Single'}</span>
                    {latestRelease.releaseDate && (
                      <>
                        <span>•</span>
                        <span>{formatDate(latestRelease.releaseDate)}</span>
                      </>
                    )}
                  </div>

                  <Link to={`/new-releases/${latestRelease.slug}`} className="group/title">
                    <h3 className="font-fraunces font-black text-2xl md:text-3xl leading-tight text-black group-hover/title:text-cobalt transition-colors">
                      {latestRelease.songTitle}
                    </h3>
                    <p className="font-mono text-xs md:text-sm font-bold text-black/80 mt-1">
                      {latestRelease.artistName}
                    </p>
                  </Link>

                  <div className="pt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <Link
                      to={`/new-releases/${latestRelease.slug}`}
                      className="inline-block bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 hover:bg-cobalt transition-colors"
                    >
                      Listen &amp; Read →
                    </Link>
                    {latestRelease.spotifyUrl && (
                      <a
                        href={latestRelease.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-2.5 border border-black hover:bg-black hover:text-white transition-colors"
                      >
                        ♫ Spotify ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* BOTTOM ROW: WEEKLY SONG POOL / STANDOUT SONGS BOX + DOOBIE BROTHERS */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8">
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[920px] min-h-[140px] border border-black/20 bg-[#e2dbd0]/45 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
              <div>
                <span className="block text-[10px] font-mono font-black uppercase tracking-[0.22em] text-cobalt mb-1">
                  Weekly Song Pool Standouts
                </span>
                <p className="font-fraunces font-black uppercase text-xl md:text-2xl text-black leading-tight tracking-tight">
                  More Songs from the Weekly Song Pool
                </p>
                <p className="font-mono text-xs text-gray-600 mt-1">
                  Standouts selected from the Weekly Song Pool
                </p>
              </div>

              <div className="relative shrink-0 flex flex-col gap-2.5 w-full sm:w-[250px]">
                <button
                  type="button"
                  onClick={() => setOpenOverlay((prev) => (prev === 'pool' ? null : 'pool'))}
                  aria-expanded={openOverlay === 'pool'}
                  className="w-full flex items-center justify-between gap-3 bg-white text-black font-mono font-bold text-xs md:text-sm px-4 py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cobalt inline-block animate-pulse shrink-0" />
                    <span>Weekly Pool Songs</span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-black shrink-0 transition-transform duration-200 ${openOverlay === 'pool' ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setOpenOverlay((prev) => (prev === 'standouts' ? null : 'standouts'))}
                  aria-expanded={openOverlay === 'standouts'}
                  className="w-full flex items-center justify-between gap-3 bg-white text-black font-mono font-bold text-xs md:text-sm px-4 py-2.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-[1px] hover:translate-x-[1px] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cobalt inline-block animate-pulse shrink-0" />
                    <span>Standout Songs</span>
                  </span>
                  <svg
                    className={`w-4 h-4 text-black shrink-0 transition-transform duration-200 ${openOverlay === 'standouts' ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: DOOBIE BROTHERS QUOTE + ALBUM COVER */}
          <div className="lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col justify-end gap-5">
            <p className="font-fraunces text-base lg:text-xl italic leading-relaxed text-black/90 text-left">
              &ldquo;Don&apos;t you feel it growing, day by day<br />
              People getting ready for the news<br />
              Some are happy, some are sad<br />
              Oh, we got to let the music play&rdquo;
            </p>

            <div className="group/album relative flex items-center justify-start gap-5 mt-2">
              <div className="relative w-[128px] h-[128px] flex-shrink-0">
                <img
                  src="/doobie-brothers-toulouse-street.png"
                  alt="Doobie Brothers - Toulouse Street"
                  className="w-[128px] h-[128px] object-cover border-2 border-black/70 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out group-hover/album:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] group-hover/album:opacity-85 relative"
                />
              </div>
              <div className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-black relative z-20">
                <a
                  href="https://open.spotify.com/track/7Ar4G7Ci11gpt6sfH9Cgz5?si=6232a0844d0f4d10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cobalt underline decoration-2 underline-offset-4 transition-colors leading-tight inline-block mb-1"
                >
                  Listen to the Music
                </a>
                <br />
                <span className="text-black/60 text-[9px] md:text-[10px]">
                  - The Doobie Brothers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING HERO OVERLAY (Weekly Pool Songs OR Standout Songs — dims Hero, click outside to close) */}
      {openOverlay && (
        <div
          onClick={() => setOpenOverlay(null)}
          className="absolute inset-0 z-50 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[540px] bg-[#f7f4ee] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-3 md:p-4"
          >
            <div className="pb-2.5 mb-3 border-b border-black/15 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-black/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cobalt inline-block" />
                {openOverlay === 'pool'
                  ? 'Weekly Pool Songs — Spotify Playlist'
                  : `Standout Songs (${standoutSongs.length} Tracks)`}
              </span>
              <button
                type="button"
                onClick={() => setOpenOverlay(null)}
                className="px-2 py-0.5 border border-black/30 hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {openOverlay === 'pool' ? (
              <iframe
                style={{ borderRadius: '10px' }}
                src={embedUrl}
                width="100%"
                height="460"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Weekly Pool Songs"
              />
            ) : standoutSongs.length > 0 ? (
              <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1">
                {standoutSongs.map((track, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-black/20 hover:border-black transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-fraunces font-black text-sm text-black truncate">
                        {track.songTitle}
                      </p>
                      <p className="text-xs font-mono font-bold text-gray-700 truncate mt-0.5">
                        {track.artistName}
                      </p>
                      {track.blurb && (
                        <p className="text-xs text-gray-600 mt-1 leading-snug">
                          {track.blurb}
                        </p>
                      )}
                    </div>

                    {track.spotifyUrl && (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-2 text-[10px] font-mono font-bold bg-neutral-900 text-white hover:bg-cobalt transition-colors"
                      >
                        ♫ Listen
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center font-mono text-xs text-gray-500">
                No standout songs added yet this week.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
