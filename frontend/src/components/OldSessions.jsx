import React, { useEffect, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { client } from '../client';

const QUERY = `*[_type == "oldSessionsPage" && _id == "oldSessionsPage"][0]{
  pageTitle,
  intro[]{
    ...,
    markDefs[]{
      ...
    }
  },
  streamusiqueCard{
    cardHeading,
    cardDescription,
    linkUrl
  },
  playlists[]{
    playlistTitle,
    spotifyUrl
  }
}`;

function getSpotifyEmbedUrl(spotifyUrl) {
  if (!spotifyUrl) return null;
  try {
    const url = new URL(spotifyUrl);
    return 'https://open.spotify.com/embed' + url.pathname;
  } catch (e) {
    return null;
  }
}

const portableTextComponents = {
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
  },
  block: {
    normal: function NormalBlock(props) {
      return <p className="mb-4 leading-relaxed">{props.children}</p>;
    },
  },
};

export default function OldSessions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    client.fetch(QUERY).then(function (res) {
      setData(res);
      setLoading(false);
    }).catch(function (err) {
      console.error('Sanity Fetch Error:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#e8e2d9]" />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Page not found.</p>
      </div>
    );
  }

  const card = data.streamusiqueCard;
  const playlists = data.playlists || [];

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">

        {/* PAGE HEADING */}
        {data.pageTitle ? (
          <h1 className="font-fraunces font-black text-3xl md:text-5xl tracking-tight text-black mb-10 pb-6 border-b-2 border-black/70">
            {data.pageTitle}
          </h1>
        ) : null}

        {/* INTRO */}
        {data.intro ? (
          <div className="text-gray-700 text-sm md:text-base font-mono leading-relaxed max-w-3xl mb-12">
            <PortableText value={data.intro} components={portableTextComponents} />
          </div>
        ) : null}

        {/* STREAMUSIQUE CARD */}
        {card && card.linkUrl ? (
          <div className="mb-14">
            {card.cardHeading ? (
              <h2 className="font-fraunces font-black text-xl md:text-2xl tracking-tight text-black mb-4">
                {card.cardHeading}
              </h2>
            ) : null}

            <div className="border-2 border-black/70 p-6 md:p-8 max-w-xl bg-white/30">
              {card.cardDescription ? (
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-6">
                  {card.cardDescription}
                </p>
              ) : null}
              <a
                href={card.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 hover:bg-gray-800 transition-all border border-black"
              >
                Visit Streamusique →
              </a>
            </div>
          </div>
        ) : null}

        {/* PLAYLISTS */}
        {playlists.length > 0 ? (
          <div>
            <h2 className="font-fraunces font-black text-xl md:text-2xl tracking-tight text-black mb-8 pb-4 border-b border-black/20">
              Playlists
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {playlists.map(function (playlist, i) {
                const embedUrl = getSpotifyEmbedUrl(playlist.spotifyUrl);
                if (!embedUrl) return null;
                return (
                  <div key={i}>
                    {playlist.playlistTitle ? (
                      <p className="text-[11px] font-mono font-black uppercase tracking-widest text-black mb-2">
                        {playlist.playlistTitle}
                      </p>
                    ) : null}
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      title={'Spotify playlist — ' + playlist.playlistTitle}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}