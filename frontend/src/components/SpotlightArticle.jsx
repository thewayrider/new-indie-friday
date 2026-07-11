import React from 'react';
import { Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';

export const portableTextComponents = {
  marks: {
    externalLink: function ExternalLinkMark(props) {
      const url = props.value && props.value.href;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-black transition-colors"
        >
          {props.children}
        </a>
      );
    },
    internalLink: function InternalLinkMark(props) {
      const refType = props.value && props.value.refType;
      const refSlug = props.value && props.value.slug;
      const basePath = refType === 'release' ? '/release' : '/spotlight';
      return (
        <Link
          to={basePath + '/' + refSlug}
          className="underline underline-offset-2 hover:text-black transition-colors"
        >
          {props.children}
        </Link>
      );
    },
  },
  types: {
    image: function ImageType(props) {
      if (!props.value || !props.value.asset) return null;
      return (
        <img
          src={props.value.asset.url}
          alt={props.value.alt || ''}
          className="float-left w-full sm:w-[45%] mr-6 mb-4 object-cover"
        />
      );
    },
  },
  block: {
    normal: function NormalBlock(props) {
      return <p className="mb-4 leading-relaxed">{props.children}</p>;
    },
  },
};

export function getSpotifyEmbedUrl(spotifyUrl) {
  if (!spotifyUrl) return null;
  try {
    const url = new URL(spotifyUrl);
    const path = url.pathname;
    return 'https://open.spotify.com/embed' + path;
  } catch (e) {
    return null;
  }
}

export function formatReleaseDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SpotlightArticle(props) {
  const data = props.data;
  if (!data) return null;

  const artistName = data.artistName;
  const genre = data.genre;
  const location = data.location;
  const songReleaseDate = data.songReleaseDate;
  const imageUrl = data.imageUrl;
  const headerImageUrl = data.headerImageUrl;
  const spotifyUrl = data.spotifyUrl;
  const albumLinkUrl = data.albumLinkUrl;
  const blurb = data.blurb;

  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);
  const releaseDateFormatted = formatReleaseDate(songReleaseDate);

  return (
    <div>
    <div className="w-full border-b-2 border-black/70 bg-[#e8e2d9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="relative flex items-center min-h-[140px] md:min-h-[180px]">

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 overflow-hidden bg-gray-300">
                {headerImageUrl ? (
                  <img
                    src={headerImageUrl}
                    alt={artistName}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <span className="inline-block bg-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2 py-1 flex-shrink-0">
                Spotlight Artist
              </span>
            </div>

            <h1 className="absolute left-0 right-0 text-center font-fraunces font-black text-black text-5xl md:text-7xl tracking-tight leading-none pointer-events-none">
              {artistName}
            </h1>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14">

          <aside className="w-full md:w-[320px] flex-shrink-0 space-y-6">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                title={'Spotify player for ' + artistName}
              />
            ) : null}

            <div className="border-t border-black/15 pt-5 space-y-3 text-[11px] font-mono uppercase tracking-widest text-gray-600">
              {genre ? (
                <div>
                  <span className="text-black/50">Genre</span>
                  <p className="text-black mt-0.5">{genre}</p>
                </div>
              ) : null}

              {location ? (
                <div>
                  <span className="text-black/50">Location</span>
                  <p className="text-black mt-0.5">{location}</p>
                </div>
              ) : null}

              {releaseDateFormatted ? (
                <div>
                  <span className="text-black/50">Release Date</span>
                  <p className="text-black mt-0.5">{releaseDateFormatted}</p>
                </div>
              ) : null}

              {albumLinkUrl ? (
                <div className="pt-2">
                  <a
                    href={albumLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline underline-offset-2 hover:text-gray-600 transition"
                  >
                    Listen to the album →
                  </a>
                </div>
              ) : null}
            </div>
          </aside>

          <main className="flex-1 text-gray-700 text-sm md:text-base font-mono leading-relaxed max-w-2xl">
            {blurb ? (
              <PortableText value={blurb} components={portableTextComponents} />
            ) : null}
          </main>

        </div>
      </div>
    </div>
  );
}