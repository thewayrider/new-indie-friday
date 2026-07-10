import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { client } from '../client';

const ThreadsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 192 192" fill="currentColor">
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.11 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.941c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 10.646 125.133 1.205 97.07 1H96.99C68.988 1.205 47.389 10.679 32.876 28.208 19.986 43.847 13.305 65.972 13.09 96c.215 30.028 6.896 52.153 19.786 67.792 14.513 17.529 36.112 26.998 64.114 27.208h.08c24.315-.173 41.413-6.525 55.636-20.733 18.559-18.532 17.994-41.923 11.86-56.351-4.308-10.046-12.67-18.268-23.029-23.928zM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const BlueskyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="square" strokeWidth="1.5" d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="square" strokeWidth="1.5" d="M4 4l16 16M20 4L4 20"/>
  </svg>
);

const navClass = ({ isActive }) =>
  isActive
    ? 'text-black border-b border-black pb-1 transition'
    : 'text-gray-400 pb-1 hover:text-black transition';

const mobileNavClass = ({ isActive }) =>
  `block font-mono font-bold uppercase tracking-widest py-3 border-b border-white/10 transition-colors text-lg ${
    isActive ? 'text-white' : 'text-white/60 hover:text-white'
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xeevrdpj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus('success'); setEmail(''); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  const closeMenu = () => setMenuOpen(false);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setTimeout(function () {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 50);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(function () {
      setSearching(true);
      client.fetch(
        `*[_type == "release" && (
          songTitle match $q ||
          artistName match $q
        )] | order(orderRank asc)[0...8]{
          _id,
          songTitle,
          artistName,
          "slug": slug.current
        }`,
        { q: val + '*' }
      ).then(function (results) {
        setSearchResults(results || []);
        setSearching(false);
      }).catch(function () {
        setSearching(false);
      });
    }, 300);
  };

  const handleResultClick = (slug) => {
    navigate('/new-releases/' + slug);
    handleSearchClose();
  };

  useEffect(function () {
    function handleKeyDown(e) {
      if (e.key === 'Escape') handleSearchClose();
    }
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        handleSearchClose();
      }
    }
    if (searchOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return function () {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <nav className="sticky top-0 z-[200] bg-[#e8e2d9] isolate py-5 md:py-6 px-6 md:px-12 flex justify-between items-center border-b-2 border-black/70 relative">

      {/* LEFT — Hamburger + Wordmark */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 border border-black/70 hover:border-black hover:bg-black hover:text-white transition"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>

        <div className="flex flex-col items-center">
          <NavLink
            to="/"
            onClick={handleHomeClick}
            className="text-black text-4xl md:text-6xl font-fraunces font-black tracking-tighter uppercase leading-none"
          >
            New Indie Friday
          </NavLink>
          <span className="text-gray-800 text-[1px] md:text-[11px] font-mono tracking-[0.15em] md:tracking-[0.3em] mt-1.5 ml-[0.5ch]">
            New Independent Music curated by Kim Rampling
          </span>
        </div>
      </div>

      {/* CENTRE — Desktop Nav */}
      <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em]">
        <NavLink to="/" end className={navClass} onClick={handleHomeClick}>Home</NavLink>
        <NavLink to="/spotlight" className={navClass}>Spotlight</NavLink>
        <NavLink to="/new-releases" className={navClass}>New Releases</NavLink>
        <NavLink to="/about" className={navClass}>About</NavLink>
        <NavLink to="/new-music-old-sessions" className={navClass}>Old Sessions</NavLink>
      </div>

      {/* RIGHT — Song Search + Subscribe + Social */}
      <div className="flex flex-col items-end gap-3">

        {/* SONG SEARCH */}
        <div ref={searchRef} className="relative hidden lg:block w-full text-center">
          {!searchOpen ? (
            <button
              onClick={handleSearchOpen}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Song Search
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/40 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search songs or artists..."
                className="bg-transparent border-b border-black text-[11px] font-mono text-black placeholder:text-black/30 outline-none w-48 py-0.5 tracking-wide"
              />
              <button
                onClick={handleSearchClose}
                className="text-black/30 hover:text-black text-xs font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* SEARCH RESULTS DROPDOWN */}
          {searchOpen && (searchQuery.trim().length > 0) && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[110]">
              {searching ? (
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest px-4 py-3">
                  Searching...
                </p>
              ) : searchResults.length === 0 ? (
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest px-4 py-3">
                  No results found
                </p>
              ) : (
                <ul>
                  {searchResults.map(function (result) {
                    return (
                      <li key={result._id}>
                        <button
                          onClick={function () { handleResultClick(result.slug); }}
                          className="w-full text-left px-4 py-3 border-b border-black/10 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-[12px] font-black font-mono uppercase tracking-wide text-black">
                            {result.songTitle}
                          </p>
                          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                            {result.artistName}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="bg-black text-white text-[11px] font-black uppercase px-6 md:px-8 py-2 tracking-widest hover:bg-gray-800 transition-all border border-black"
        >
          Subscribe
        </button>

        <div className="hidden lg:flex items-center justify-center gap-4 opacity-40 hover:opacity-100 transition-opacity w-full">
          <a href="https://www.threads.com/@kimrampling" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
            <ThreadsIcon />
          </a>
          <a href="https://x.com/kimrampling" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
            <XIcon />
          </a>
          <a href="https://bsky.app/profile/kimrampling.bsky.social" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500">
            <BlueskyIcon />
          </a>
        </div>
      </div>

      {/* HAMBURGER DROPDOWN */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/10 z-[99] lg:hidden">
          <div className="px-6 py-8 space-y-6">
            <NavLink to="/" end onClick={() => { handleHomeClick(); closeMenu(); }} className={mobileNavClass}>Home</NavLink>
            <NavLink to="/spotlight" onClick={closeMenu} className={mobileNavClass}>Spotlight</NavLink>
            <NavLink to="/new-releases" onClick={closeMenu} className={mobileNavClass}>New Releases</NavLink>
            <NavLink to="/about" onClick={closeMenu} className={mobileNavClass}>About</NavLink>
            <NavLink to="/new-music-old-sessions" onClick={closeMenu} className={mobileNavClass}>Old Sessions</NavLink>

            <div className="flex items-center gap-5 pt-4">
              <a href="https://www.threads.com/@kimrampling" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <ThreadsIcon />
              </a>
              <a href="https://x.com/kimrampling" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <XIcon />
              </a>
              <a href="https://bsky.app/profile/kimrampling.bsky.social" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <BlueskyIcon />
              </a>
            </div>

            <button
              onClick={() => { setOpen(!open); closeMenu(); }}
              className="w-full bg-black text-white text-[11px] font-black uppercase px-8 py-4 tracking-widest hover:bg-gray-800 transition-colors border border-white/20"
            >
              Subscribe
            </button>
          </div>
        </div>
      )}

      {/* SUBSCRIBE DROPDOWN */}
      {open && (
        <div className="absolute top-full right-6 md:right-12 mt-2 w-80 bg-white border border-black p-8 z-[110] shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-4 text-black/30 hover:text-black text-xs font-bold"
          >
            ✕
          </button>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-black mb-2">
            Stay in the loop
          </p>
          <p className="font-fraunces text-black text-lg leading-tight mb-5 font-bold">
            New discoveries every Friday.
          </p>

          {status === 'success' ? (
            <p className="font-mono text-black text-sm font-bold text-center py-2 border-2 border-black">
              YOU'RE IN. SEE YOU FRIDAY.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border-2 border-black text-black text-[11px] tracking-widest placeholder:text-black/30 px-4 py-4 outline-none focus:bg-white transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-black text-white text-[11px] font-black uppercase tracking-widest px-4 py-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
          )}
        </div>
      )}
    </nav>
  );
}