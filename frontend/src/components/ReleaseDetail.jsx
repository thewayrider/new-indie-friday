import { Link, useLoaderData } from 'react-router';
import { PortableText } from '@portabletext/react';
import { client } from '../client';
import { buildMeta, SITE_URL } from '../seo';
import LikeDislike from './LikeDislike';

const QUERY = `*[_type == "release" && slug.current == $slug][0]{
  _id,
  songTitle,
  artistName,
  releaseType,
  albumOrEpName,
  genre,
  spotifyUrl,
  discoverySource,
  discoveryUrl,
  socialLinks[]{
    platform,
    url
  },
  releaseDate,
  "slug": slug.current,
  "albumArtUrl": albumArt.asset->url,
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

export async function loader({ params }) {
  const release = await client.fetch(QUERY, { slug: params.slug });
  if (!release) return { release: null, odesliData: null };
  
  let odesliData = null;
  if (release.spotifyUrl) {
    try {
      const res = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(release.spotifyUrl)}`);
      if (res.ok) {
        odesliData = await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch Odesli links:', e);
    }
  }

  return { release, odesliData: odesliData || null };
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

// Format-word label: the small label is the format word, the bold value is
// the EP/album name. A single has no name. Falls back to legacy behaviour for
// records not yet given a releaseType in Studio.
function getTypeDisplay(release) {
  const type = release.releaseType;
  if (type === 'album') return { word: 'Album', name: release.albumOrEpName || null };
  if (type === 'ep') return { word: 'EP', name: release.albumOrEpName || null };
  if (type === 'single') return { word: 'Single', name: null };
  return release.albumOrEpName
    ? { word: 'Type', name: release.albumOrEpName }
    : { word: 'Single', name: null };
}

const SOURCE_DEFAULT_URLS = {
  'Acid Stag': 'https://acidstag.com',
  'AIR Charts': 'https://air.org.au',
  'allmusic.com': 'https://www.allmusic.com',
  'AllMusic': 'https://www.allmusic.com',
  'AMRAP Indie': 'https://amrap.org.au',
  'Bandcamp Indie': 'https://bandcamp.com',
  'chosic.com': 'https://www.chosic.com',
  'Chosic': 'https://www.chosic.com',
  'Futuremag Music': 'https://www.futuremagmusic.net',
  'Happy Mag': 'https://happymag.tv',
  'ListenBrainz / MusicBrainz': 'https://musicbrainz.org',
  'MusicBrainz': 'https://musicbrainz.org',
  'Rolling Stone AU': 'https://au.rollingstone.com',
  'Roots Online NZ': 'https://rootsmusic.co.nz',
  'Spotify': 'https://open.spotify.com',
  'Spotify New Music Friday': 'https://open.spotify.com',
  'Triple J': 'https://www.abc.net.au/triplej',
  'Triple J Unearthed': 'https://www.abc.net.au/triplejunearthed',
};

function getSourceDisplay(source, customUrl) {
  if (!source) return null;
  const url = customUrl || SOURCE_DEFAULT_URLS[source] || null;
  const labels = {
    'chosic.com': 'chosic.com',
    'allmusic.com': 'allmusic.com',
    'MusicBrainz': 'ListenBrainz / MusicBrainz',
    'Spotify': 'Spotify New Music Friday',
    'Direct Submission': 'Direct Submission',
  };
  const label = labels[source] || source;
  return { label, url };
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

export function meta({ data, params }) {
  const r = data && data.release;
  const odesliData = data && data.odesliData;

  if (!r) return buildMeta({ title: 'Release', path: `/new-releases/${params.slug}` });
  const title = `${r.songTitle} by ${r.artistName}`;
  const typeLabel =
    r.releaseType === 'album'
      ? `from the album '${r.albumOrEpName}'`
      : r.releaseType === 'ep'
      ? `from the EP '${r.albumOrEpName}'`
      : r.releaseType === 'single'
      ? 'a new single'
      : r.albumOrEpName
      ? `from '${r.albumOrEpName}'`
      : 'a new single';
  const description = `${r.songTitle} by ${r.artistName} — ${typeLabel}${r.genre ? ', ' + r.genre : ''}. Curated by New Indie Friday.`;

  // Aggregate all streaming links for the track's sameAs property
  const trackSameAs = [];
  if (r.spotifyUrl) trackSameAs.push(r.spotifyUrl);
  if (odesliData && odesliData.linksByPlatform) {
    Object.values(odesliData.linksByPlatform).forEach(link => {
      if (link.url && !trackSameAs.includes(link.url)) trackSameAs.push(link.url);
    });
  }

  // Aggregate all social links for the artist's sameAs property
  const artistSameAs = [];
  if (r.socialLinks) {
    r.socialLinks.forEach(social => {
      if (social.url) artistSameAs.push(social.url);
    });
  }

  return [
    ...buildMeta({ title, description, path: `/new-releases/${params.slug}`, image: r.albumArtUrl, type: 'music.song' }),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'MusicRecording',
        name: r.songTitle,
        byArtist: { 
          '@type': 'MusicGroup', 
          name: r.artistName,
          ...(artistSameAs.length > 0 ? { sameAs: artistSameAs } : {})
        },
        ...(trackSameAs.length > 0 ? { sameAs: trackSameAs } : {}),
        ...((r.releaseType === 'album' || r.releaseType === 'ep' || (!r.releaseType && r.albumOrEpName)) && r.albumOrEpName
          ? { inAlbum: { '@type': 'MusicAlbum', name: r.albumOrEpName } }
          : {}),
        ...(r.genre ? { genre: r.genre } : {}),
        ...(r.releaseDate ? { datePublished: r.releaseDate } : {}),
        ...(r.albumArtUrl ? { image: r.albumArtUrl } : {}),
        url: SITE_URL + '/new-releases/' + params.slug,
      },
    },
  ];
}

export default function ReleaseDetail() {
  const { release, odesliData } = useLoaderData();

  if (!release) {
    return (
      <div className="min-h-screen bg-[#e8e2d9] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Release not found.</p>
      </div>
    );
  }

  const data = release;
  const embedUrl = getSpotifyEmbedUrl(data.spotifyUrl);
  const typeDisplay = getTypeDisplay(data);
  const sourceDisplay = getSourceDisplay(data.discoverySource, data.discoveryUrl);

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
          {/* TITLE */}
          <h1 className="font-fraunces font-black text-4xl md:text-5xl tracking-tight text-black leading-[1.1]">
            {data.songTitle}
          </h1>
          <p className="mt-2 mb-8 text-[12px] font-mono uppercase tracking-widest text-black/50">
            {data.artistName}
          </p>

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
          {/* SONG DETAILS (below the description) */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 mt-10 pt-6 border-t border-black/10 font-mono uppercase tracking-wide">
            <div>
              <span className="text-[13px] text-black/40 mr-1.5">Song</span>
              <span className="text-[16px] text-black font-black">{data.songTitle}</span>
            </div>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              <span className="text-[13px] text-black/40 mr-1.5">Artist</span>
              <span className="text-[16px] text-black font-black">{data.artistName}</span>
            </div>
            <span className="text-black/20 hidden md:block">·</span>
            <div>
              {typeDisplay.name ? (
                <>
                  <span className="text-[13px] text-black/40 mr-1.5">{typeDisplay.word}</span>
                  <span className="text-[16px] text-black font-black">{typeDisplay.name}</span>
                </>
              ) : (
                <span className="text-[16px] text-black font-black">{typeDisplay.word}</span>
              )}
            </div>
            {data.genre ? (
              <>
                <span className="text-black/20 hidden md:block">·</span>
                <div>
                  <span className="text-[13px] text-black/40 mr-1.5">Genre</span>
                  <span className="text-[16px] text-black font-black">{data.genre}</span>
                </div>
              </>
            ) : null}
            {data.releaseDate ? (
              <>
                <span className="text-black/20 hidden md:block">·</span>
                <div>
                  <span className="text-[13px] text-black/40 mr-1.5">Released</span>
                  <span className="text-[16px] text-black font-black">{formatDate(data.releaseDate)}</span>
                </div>
              </>
            ) : null}
            {sourceDisplay ? (
              <>
                <span className="text-black/20 hidden md:block">·</span>
                <div>
                  <span className="text-[13px] text-black/40 mr-1.5">Discovered via</span>
                  {sourceDisplay.url ? (
                    <a
                      href={sourceDisplay.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[16px] text-black font-black underline underline-offset-2 hover:text-black/60 transition-colors inline-flex items-center gap-1"
                    >
                      {sourceDisplay.label} <span className="text-[12px] opacity-70">↗</span>
                    </a>
                  ) : (
                    <span className="text-[16px] text-black font-black">{sourceDisplay.label}</span>
                  )}
                </div>
              </>
            ) : null}
          </div>

          <LikeDislike slug={data.slug} />

          {/* DYNAMIC LINKS SECTION */}
          <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row gap-12">
            
            {/* STREAMING LINKS */}
            {odesliData && (
              <div className="flex-1">
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-black/40 mb-4">
                  Listen on
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['spotify', 'appleMusic', 'youtube', 'youtubeMusic', 'deezer', 'tidal', 'amazonMusic', 'soundcloud', 'pandora'].map(platformId => {
                    const linkData = odesliData.linksByPlatform[platformId];
                    if (!linkData) return null;
                    const labels = {
                      spotify: 'Spotify',
                      appleMusic: 'Apple Music',
                      youtube: 'YouTube',
                      youtubeMusic: 'YT Music',
                      deezer: 'Deezer',
                      tidal: 'Tidal',
                      amazonMusic: 'Amazon',
                      soundcloud: 'SoundCloud',
                      pandora: 'Pandora'
                    };
                    return (
                      <a
                        key={platformId}
                        href={linkData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono font-bold uppercase tracking-widest px-4 py-2 bg-white border border-black/20 hover:border-cobalt hover:bg-cobalt hover:text-white transition-colors shadow-sm"
                      >
                        {labels[platformId] || platformId}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SOCIAL LINKS */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex-1">
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-black/40 mb-4">
                  Follow & Connect
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.socialLinks.map((social, index) => {
                    const labels = {
                      website: 'Website',
                      x: 'X (Twitter)',
                      instagram: 'Instagram',
                      facebook: 'Facebook',
                      wikipedia: 'Wikipedia',
                      youtube: 'YouTube',
                      tiktok: 'TikTok',
                    };
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono font-bold uppercase tracking-widest px-4 py-2 bg-black text-white border border-black hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        {labels[social.platform] || social.platform}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </article>

      </div>
    </div>
  );
}
