import React from 'react';

/**
 * Resolves the platform name from explicit platform field or by inspecting the URL.
 */
export function getPlatform(url, explicitPlatform) {
  if (explicitPlatform) {
    const p = explicitPlatform.toLowerCase();
    if (p.includes('soundcloud')) return 'soundcloud';
    if (p.includes('spotify')) return 'spotify';
    if (p.includes('bandcamp')) return 'bandcamp';
    if (p.includes('apple')) return 'appleMusic';
    if (p.includes('youtube')) return 'youtube';
  }

  if (!url) return 'spotify';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('soundcloud.com')) return 'soundcloud';
    if (host.includes('spotify.com')) return 'spotify';
    if (host.includes('bandcamp.com')) return 'bandcamp';
    if (host.includes('apple.com')) return 'appleMusic';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  } catch (e) {
    // ignore URL parsing errors
  }

  return 'spotify';
}

/**
 * Returns a human-friendly display label for the platform.
 */
export function getPlatformLabel(url, explicitPlatform) {
  const p = getPlatform(url, explicitPlatform);
  switch (p) {
    case 'soundcloud':
      return 'SoundCloud';
    case 'bandcamp':
      return 'Bandcamp';
    case 'appleMusic':
      return 'Apple Music';
    case 'youtube':
      return 'YouTube';
    case 'spotify':
    default:
      return 'Spotify';
  }
}

/**
 * Builds Spotify embed URL from a Spotify URL.
 */
export function getSpotifyEmbedUrl(spotifyUrl) {
  if (!spotifyUrl) return null;
  try {
    const url = new URL(spotifyUrl);
    return 'https://open.spotify.com/embed' + url.pathname;
  } catch (e) {
    return null;
  }
}

/**
 * Builds SoundCloud embed widget URL.
 */
export function getSoundCloudEmbedUrl(soundCloudUrl) {
  if (!soundCloudUrl) return null;
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    soundCloudUrl
  )}&color=%23111111&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

/**
 * Extracts YouTube video ID and builds embed URL.
 */
export function getYouTubeEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return null;
  try {
    const url = new URL(youtubeUrl);
    let videoId = null;
    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get('v');
    }
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (e) {
    return null;
  }
}

/**
 * MusicEmbed renders the appropriate iframe player widget based on the platform.
 */
export default function MusicEmbed({ url, platform, title, height = 152 }) {
  if (!url) return null;

  const detectedPlatform = getPlatform(url, platform);

  if (detectedPlatform === 'soundcloud') {
    const src = getSoundCloudEmbedUrl(url);
    if (!src) return null;
    return (
      <iframe
        src={src}
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        title={title ? `SoundCloud player for ${title}` : 'SoundCloud player'}
        className="rounded shadow-sm"
        loading="lazy"
      />
    );
  }

  if (detectedPlatform === 'youtube') {
    const src = getYouTubeEmbedUrl(url);
    if (src) {
      return (
        <iframe
          src={src}
          width="100%"
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title ? `YouTube player for ${title}` : 'YouTube player'}
          className="rounded shadow-sm"
          loading="lazy"
        />
      );
    }
  }

  // Default to Spotify embed
  const spotifySrc = getSpotifyEmbedUrl(url);
  if (spotifySrc) {
    return (
      <iframe
        src={spotifySrc}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title={title ? `Spotify player for ${title}` : 'Spotify player'}
        className="rounded shadow-sm"
        loading="lazy"
      />
    );
  }

  return null;
}
