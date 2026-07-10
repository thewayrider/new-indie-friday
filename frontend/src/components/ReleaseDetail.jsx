import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../client';
import LikeDislike from './LikeDislike';

const QUERY = `*[_type == "release" && slug.current == $slug][0]{
  _id,
  songTitle,
  artistName,
  albumOrEpName,
  genre,
  spotifyUrl,
  releaseDate,
  "slug": slug.current,
  blurb[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": reference->slug.current,
        "refType": reference->_type
      }
    }
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

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
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
    internalLink: function InternalLinkMark(props) {
      const refType = props.value && props.value.refType;
      const refSlug = props.value && props.value.slug;
      const basePath = refType === 'release' ? '/new-releases' : '/spotlight';
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
  block: {
    normal: function NormalBlock(props) {
      return <p className="mb-4 leading-relaxed">{props.children}</p>;
    },
  },
};

export default function ReleaseDetail() {
  const params = useParams();
  const slug = params.slug;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    setLoading(true);
    client.fetch(QUERY, { slug: slug }).then(function (res) {
      setData(res);
      setLoading(false);
    }).catch(function (err) {
      console.error('Sanity Fetch Error:', err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#e8e2d9]" />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Release not found.</p>
      </div>
    );
  }

  const embedUrl = getSpotifyEmbedUrl(data.spotifyUrl);

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">

        <div className="mb-6">
          <Link
            to="/new-releases"
            className="text-[11px] font-mono font-black uppercase tracking-widest text-black/50 hover:text-black transition underline underline-offset-2"
          >
            ← Back to New Releases
          </Link>
        </div>

        <article>
          {/* METADATA STRIP */}
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-6 pb-5 border-b border-black/10 font-mono uppercase tracking-widest">
            <div>
              <span className="text-[11px] text-black/40 mr-1">Song</span>
              <span className="text-[13px] text-black font-black">{data.songTitle}</span>
            </div>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              <span className="text-[11px] text-black/40 mr-1">Artist</span>
              <span className="text-[13px] text-black font-black">{data.artistName}</span>
            </div>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              <span className="text-[11px] text-black/40 mr-1">Type</span>
              <span className="text-[13px] text-black font-black">
                {data.albumOrEpName ? data.albumOrEpName : 'Single'}
              </span>
            </div>
            {data.genre ? (
              <>
                <span className="text-black/20 hidden md:block">·</span>
                <div>
                  <span className="text-[11px] text-black/40 mr-1">Genre</span>
                  <span className="text-[13px] text-black font-black">{data.genre}</span>
                </div>
              </>
            ) : null}
            {data.releaseDate ? (
              <>
                <span className="text-black/20 hidden md:block">·</span>
                <div>
                  <span className="text-[11px] text-black/40 mr-1">Released</span>
                  <span className="text-[13px] text-black font-black">{formatDate(data.releaseDate)}</span>
                </div>
              </>
            ) : null}
          </div>

          {/* EMBED + BLURB */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {embedUrl ? (
              <div className="w-full md:w-[280px] flex-shrink-0">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  title={'Spotify player for ' + data.songTitle}
                />
              </div>
            ) : null}

            <main className="flex-1 text-gray-700 text-sm md:text-base font-mono leading-relaxed">
              {data.blurb ? (
                <PortableText value={data.blurb} components={portableTextComponents} />
              ) : null}
            </main>
          </div>
          <LikeDislike slug={data.slug} />
        </article>

      </div>
    </div>
  );
}