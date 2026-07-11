import React, { useEffect, useState } from 'react';

export default function LikeDislike({ slug }) {
  const [counts, setCounts] = useState({ likes: 0, dislikes: 0 });
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const storageKey = 'vote:' + slug;

  useEffect(function () {
    const stored = localStorage.getItem(storageKey);
    if (stored) setVoted(stored);

    fetch('/api/likes/get?slug=' + slug)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setCounts({ likes: data.likes || 0, dislikes: data.dislikes || 0 });
        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
      });
  }, [slug]);

  function handleVote(type) {
    if (voted || voting) return;

    setVoting(true);

    fetch('/api/likes/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug, type: type }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setCounts({ likes: data.likes || 0, dislikes: data.dislikes || 0 });
        setVoted(type);
        localStorage.setItem(storageKey, type);
        setVoting(false);
      })
      .catch(function () {
        setVoting(false);
      });
  }

  if (loading) return null;

  return (
    <div className="flex items-center gap-4 pt-6 mt-6 border-t border-black/10">
      <span className="text-[11px] font-mono uppercase tracking-widest text-black/50 mr-2">
        Rate this track
      </span>

      <button
        onClick={function () { handleVote('like'); }}
        disabled={!!voted || voting}
        className={
          'flex items-center gap-2 px-4 py-2 border text-[11px] font-mono font-black uppercase tracking-widest transition-all ' +
          (voted === 'like'
            ? 'bg-black text-white border-black'
            : voted
            ? 'border-black/20 text-black/30 cursor-not-allowed'
            : 'border-black text-black hover:bg-black hover:text-white')
        }
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        {counts.likes}
      </button>

      <button
        onClick={function () { handleVote('dislike'); }}
        disabled={!!voted || voting}
        className={
          'flex items-center gap-2 px-4 py-2 border text-[11px] font-mono font-black uppercase tracking-widest transition-all ' +
          (voted === 'dislike'
            ? 'bg-black text-white border-black'
            : voted
            ? 'border-black/20 text-black/30 cursor-not-allowed'
            : 'border-black text-black hover:bg-black hover:text-white')
        }
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
        </svg>
        {counts.dislikes}
      </button>

      {voted && (
        <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">
          Thanks for your vote
        </span>
      )}
    </div>
  );
}