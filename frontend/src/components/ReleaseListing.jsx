import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { client } from '../client';

const RELEASES_PER_PAGE = 5;

function buildQuery(page) {
  const start = (page - 1) * RELEASES_PER_PAGE;
  const end = start + RELEASES_PER_PAGE;
  return `{
    "releases": *[_type == "release"] | order(orderRank asc)[${start}...${end}]{
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
    },
    "total": count(*[_type == "release"])
  }`;
}

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

function ReleaseEntry({ release }) {
  const embedUrl = getSpotifyEmbedUrl(release.spotifyUrl);

  return (
    <article
      id={release.slug}
      className="py-10 border-b border-black/10 last:border-b-0"
    >
      {/* METADATA STRIP */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-6 pb-5 border-b border-black/10 font-mono uppercase tracking-widest">
        <div>
          <span className="text-[11px] text-black/40 mr-1">Song</span>
          <span className="text-[13px] text-black font-black">{release.songTitle}</span>
        </div>
        <span className="text-black/20 hidden md:block">·</span>
        <div>
          <span className="text-[11px] text-black/40 mr-1">Artist</span>
          <span className="text-[13px] text-black font-black">{release.artistName}</span>
        </div>
        <span className="text-black/20 hidden md:block">·</span>
        <div>
          <span className="text-[11px] text-black/40 mr-1">Type</span>
          <span className="text-[13px] text-black font-black">
            {release.albumOrEpName ? release.albumOrEpName : 'Single'}
          </span>
        </div>
        {release.genre ? (
          <>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              <span className="text-[11px] text-black/40 mr-1">Genre</span>
              <span className="text-[13px] text-black font-black">{release.genre}</span>
            </div>
          </>
        ) : null}
        {release.releaseDate ? (
          <>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              <span className="text-[11px] text-black/40 mr-1">Released</span>
              <span className="text-[13px] text-black font-black">{formatDate(release.releaseDate)}</span>
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
              title={'Spotify player for ' + release.songTitle}
            />
          </div>
        ) : null}

        <main className="flex-1 text-gray-700 text-sm md:text-base font-mono leading-relaxed">
          {release.blurb ? (
            <PortableText value={release.blurb} components={portableTextComponents} />
          ) : null}
        </main>
      </div>

    </article>
  );
}

export default function ReleaseListing() {
  const params = useParams();
  const currentPage = params.page ? parseInt(params.page, 10) : 1;

  const [data, setData] = useState({ releases: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    setLoading(true);
    client.fetch(buildQuery(currentPage)).then(function (res) {
      setData({
        releases: res.releases || [],
        total: res.total || 0,
      });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(function (err) {
      console.error('Sanity Fetch Error:', err);
      setLoading(false);
    });
  }, [currentPage]);

  if (loading) {
    return <div className="min-h-screen bg-[#e8e2d9]" />;
  }

  const totalPages = Math.ceil(data.total / RELEASES_PER_PAGE);

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">

        {data.releases.length === 0 ? (
          <p className="font-mono text-sm text-gray-500">No releases yet.</p>
        ) : (
          data.releases.map(function (release) {
            return (
              <ReleaseEntry key={release._id} release={release} />
            );
          })
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between pt-10 border-t border-black/10 mt-4">
            {currentPage > 1 ? (
              <Link
                to={currentPage === 2 ? '/new-releases' : '/new-releases/page/' + (currentPage - 1)}
                className="text-[11px] font-mono font-black uppercase tracking-widest text-black underline underline-offset-2 hover:text-gray-600 transition"
              >
                ← Newer Posts
              </Link>
            ) : (
              <span />
            )}

            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                to={'/new-releases/page/' + (currentPage + 1)}
                className="text-[11px] font-mono font-black uppercase tracking-widest text-black underline underline-offset-2 hover:text-gray-600 transition"
              >
                Older Posts →
              </Link>
            ) : (
              <span />
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}