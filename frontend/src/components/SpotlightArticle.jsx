import React from 'react';
import MusicEmbed, { getPlatformLabel } from './MusicEmbed';
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
    link: function LinkMark(props) {
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
  list: {
    bullet: function BulletList(props) {
      return (
        <ul className="list-disc list-outside ml-5 mb-4 space-y-1">
          {props.children}
        </ul>
      );
    },
    number: function NumberList(props) {
      return (
        <ol className="list-decimal list-outside ml-5 mb-4 space-y-1">
          {props.children}
        </ol>
      );
    },
  },
  listItem: {
    bullet: function BulletItem(props) {
      return <li className="leading-relaxed">{props.children}</li>;
    },
    number: function NumberItem(props) {
      return <li className="leading-relaxed">{props.children}</li>;
    },
  },
  types: {
    image: function ImageType(props) {
      if (!props.value || !props.value.asset) return null;
      return (
        <figure className="my-6">
          <img
            src={props.value.asset.url}
            alt={props.value.alt || ''}
            className="w-full md:w-2/3 object-cover"
          />
          {props.value.caption ? (
            <figcaption className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-2">
              {props.value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
  block: {
    normal: function NormalBlock(props) {
      return <p className="mb-4 leading-relaxed">{props.children}</p>;
    },
    h2: function H2Block(props) {
      return (
        <h2 className="font-fraunces font-black text-2xl text-black tracking-tight mt-10 mb-4">
          {props.children}
        </h2>
      );
    },
    h3: function H3Block(props) {
      return (
        <h3 className="font-fraunces font-black text-xl text-black tracking-tight mt-8 mb-3">
          {props.children}
        </h3>
      );
    },
    h4: function H4Block(props) {
      return (
        <h4 className="font-fraunces font-bold text-lg text-black tracking-tight mt-6 mb-2">
          {props.children}
        </h4>
      );
    },
    blockquote: function BlockquoteBlock(props) {
      return (
        <blockquote className="border-l-4 border-black pl-4 py-1 my-6 italic text-gray-600">
          {props.children}
        </blockquote>
      );
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
  const musicPlatform = data.musicPlatform;
  const spotifyUrl = data.spotifyUrl;
  const albumLinkUrl = data.albumLinkUrl;
  const blurb = data.blurb;
  const subsequentReleases = data.subsequentReleases || [];

  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);
  const releaseDateFormatted = formatReleaseDate(songReleaseDate);

  return (
    <div>
    <div className="w-full border-b-2 border-black/70 bg-[#e8e2d9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="flex items-center gap-4 md:gap-8 min-h-[140px] md:min-h-[180px]">

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 overflow-hidden bg-gray-300">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={artistName}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <span className="inline-block bg-black text-white text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2 py-1 flex-shrink-0">
                {data.featureCategory || 'Spotlight Artist'}
              </span>
            </div>

            <div className="flex-1 min-w-0 text-center">
              <h1 className="font-fraunces font-black text-black text-5xl md:text-7xl tracking-tight leading-none">
                {artistName}
              </h1>
              {data.albumSubtitle && (
                <p className="mt-2 font-mono text-sm md:text-base font-semibold text-black/75">
                  {data.albumSubtitle}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14">

          <aside className="w-full md:w-[320px] flex-shrink-0 space-y-6">
            {spotifyUrl ? (
              <MusicEmbed
                url={spotifyUrl}
                platform={musicPlatform}
                title={artistName}
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

            {subsequentReleases.length > 0 ? (
              <div id="subsequent-releases" className="border-t-2 border-black pt-5 space-y-3 scroll-mt-24">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cobalt inline-block animate-pulse"></span>
                  <h4 className="text-[11px] font-mono font-black uppercase tracking-[0.2em] text-black">
                    Subsequent Releases
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {subsequentReleases.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/80 border-2 border-black p-3 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-black leading-snug">
                          {item.title}
                        </span>
                        {item.releaseDate ? (
                          <span className="text-[10px] font-mono text-gray-500 shrink-0">
                            {new Date(item.releaseDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        ) : null}
                      </div>
                      {item.note ? (
                        <p className="text-[10px] text-gray-600 font-mono italic leading-snug">
                          {item.note}
                        </p>
                      ) : null}
                      {item.spotifyUrl ? (
                        <div className="pt-1">
                          <a
                            href={item.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-black underline underline-offset-2 hover:text-cobalt transition"
                          >
                            Listen on {getPlatformLabel(item.spotifyUrl, item.musicPlatform)} ↗
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
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