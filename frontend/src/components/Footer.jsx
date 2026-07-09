import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

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

const navClass = ({ isActive }) =>
  isActive
    ? 'text-black font-black underline underline-offset-4 decoration-2'
    : 'hover:text-black transition text-gray-500 font-bold';

export default function Footer({ weeklyPick }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  

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

  return (
    <>
     <div className="w-full border-t-2 border-black/70" />

      {/* MAIN FOOTER */}
      <footer className="bg-[#e8e2d9] text-black pt-14 pb-10 px-6 md:px-12 border-t border-black/20">

        {/* Newsletter CTA */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-fraunces font-black mb-4 tracking-tighter leading-tight text-black">
            New Music Every Friday
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-mono mb-10 max-w-xl mx-auto leading-relaxed">
            Curated New Song Releases by Kim Rampling
          </p>

          {status === 'success' ? (
            <div className="max-w-md mx-auto py-6 bg-black/5 border border-black/20">
              <p className="text-black text-sm font-mono font-black tracking-widest uppercase">
                You're in. See you Friday.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row max-w-md mx-auto border-2 border-black overflow-hidden"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white flex-grow p-4 outline-none text-[11px] tracking-[0.1em] placeholder:text-gray-400 font-mono text-black"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-black text-white font-mono font-black px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto border-t border-black/10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">

            {/* Brand */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-fraunces font-black tracking-tighter text-black">
                New Indie Friday
              </h3>
              <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest max-w-[220px] leading-loose">
                Independent music discoveries, curated weekly.
              </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-mono uppercase tracking-[0.2em]">
              <NavLink to="/" end className={navClass}>Home</NavLink>
              <NavLink to="/spotlight" className={navClass}>Spotlight</NavLink>
              <NavLink to="/new-releases" className={navClass}>New Releases</NavLink>
              <NavLink to="/about" className={navClass}>About</NavLink>
              <NavLink to="/new-music-old-sessions" className={navClass}>Old Sessions</NavLink>
            </nav>

            {/* Social + Copyright */}
            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="flex items-center gap-5">
                <a href="https://www.threads.com/@kimrampling" target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors">
                  <ThreadsIcon />
                </a>
                <a href="https://x.com/kimrampling" target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors">
                  <XIcon />
                </a>
                <a href="https://bsky.app/profile/kimrampling.bsky.social" target="_blank" rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors">
                  <BlueskyIcon />
                </a>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                © Kim Rampling 2026
              </p>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}