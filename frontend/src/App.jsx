import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { client } from './client';

import Header from './components/Header';
import Hero from './components/Hero';
import Releases from './components/Releases';
import Footer from './components/Footer';
import About from './components/About';
import OldSessions from './components/OldSessions';
import SpotlightDetail from './components/SpotlightDetail';
import SpotlightListing from './components/SpotlightListing';
import ReleaseListing from './components/ReleaseListing';
import ReleaseDetail from './components/ReleaseDetail';


// ── SCROLL TO TOP ON ROUTE CHANGE ──
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// ── MAIN APP COMPONENT ──
const App = () => {
  const [data, setData] = useState({
    spotlightArtist: null,
    releases: [],
    weeklyPick: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const query = `{
      "homepage": *[_type == "homepage"] | order(_updatedAt desc)[0]{
        "weeklyPick": weeklyPick{
          artistName,
          trackName,
          spotifyUrl
        }
      },
"spotlightArtist": *[_type == "spotlightArtist" && isCurrent == true] | order(featuredDate desc)[0]{
        artistName,
        teaser,
        "imageUrl": image.asset->url,
        "slug": slug.current
      },
      "releases": *[_type == "release"] | order(orderRank asc)[0...6]{
        _id,
        songTitle,
        artistName,
        albumOrEpName,
        genre,
        spotifyUrl,
        releaseDate,
        "slug": slug.current,
        "albumArtUrl": albumArt.asset->url
      }
    }`;

   client.fetch(query).then((res) => {
  setData({
    spotlightArtist: res.spotlightArtist || null,
    weeklyPick: res.homepage?.weeklyPick || null,
    releases: res.releases || [],
  });
  setLoading(false);
}).catch(err => {
  console.error("Sanity Fetch Error:", err);
  setLoading(false);
});
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#e8e2d9] text-black font-manrope">
        <Header />

        <Routes>
          <Route path="/" element={
            <>
              <Hero
                spotlightArtist={data.spotlightArtist}
                isLoading={loading}
              />
              <Releases releases={data.releases} />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/new-music-old-sessions" element={<OldSessions />} />
          <Route path="/spotlight" element={<SpotlightListing />} />
          <Route path="/new-releases" element={<ReleaseListing />} />
<Route path="/new-releases/page/:page" element={<ReleaseListing />} />
<Route path="/new-releases/:slug" element={<ReleaseDetail />} />
          
        </Routes>

        <Footer weeklyPick={data.weeklyPick} />
      </div>
    </Router>
  );
};

export default App;