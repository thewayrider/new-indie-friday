import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import SpotlightArticle from './SpotlightArticle';

const QUERY = `*[_type == "spotlightArtist" && slug.current == $slug][0]{
  artistName,
  genre,
  location,
  songReleaseDate,
  "imageUrl": image.asset->url,
  "headerImageUrl": headerImage.asset->url,
  spotifyUrl,
  albumLinkUrl,
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

export default function SpotlightDetail() {
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
        <p className="font-mono text-sm text-gray-500">Spotlight post not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#e8e2d9] min-h-screen">
      <SpotlightArticle data={data} />
    </div>
  );
}