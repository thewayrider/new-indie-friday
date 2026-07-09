import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../client';

const ThreadsIcon = () => (
  <svg width="11" height="11" viewBox="0 0 192 192" fill="currentColor">
    <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.11 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.941c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 10.646 125.133 1.205 97.07 1H96.99C68.988 1.205 47.389 10.679 32.876 28.208 19.986 43.847 13.305 65.972 13.09 96c.215 30.028 6.896 52.153 19.786 67.792 14.513 17.529 36.112 26.998 64.114 27.208h.08c24.315-.173 41.413-6.525 55.636-20.733 18.559-18.532 17.994-41.923 11.86-56.351-4.308-10.046-12.67-18.268-23.029-23.928zM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274z"/>
  </svg>
);

const FILTERS = ['ALL', 'LINKED', 'UNLINKED'];

export default function WireSignalArchive() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    client.fetch(
      `*[_type == "wireSignal"] | order(publishedAt desc){
        _id,
        title,
        threadText,
        threadsUrl,
        publishedAt,
        "slug": internalLink->slug.current
      }`
    ).then((data) => {
      setSignals(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = signals.filter((s) => {
    if (filter === 'LINKED') return !!s.slug;
    if (filter === 'UNLINKED') return !s.slug;
    return true;
  });

  const formatDate = (iso) => {
    if (!iso) return '——';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-[#111318] text-white">

      {/* ── Page Header ── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-investigation text-white text-[10px] font-mono font-black px-2 py-1 tracking-widest uppercase">
              ARCHIVE
            </span>
            <span className="text-white/20 text-[10px] font-mono tracking-widest">
              ARCHIVE_TYPE: WIRE_SIGNAL
            </span>
          </div>
          <h1 className="font-fraunces text-4xl md:text-6xl font-black tracking-tighter text-white leading-none mb-3">
            Signal Archive
          </h1>
          <p className="text-white/40 text-[11px] font-mono uppercase tracking-[0.2em]">
            All raw field signals — origin: @kimrampling // Threads
          </p>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-4 bg-black/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1.5 transition-colors ${
                  filter === f
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            {loading ? 'LOADING...' : `${filtered.length} SIGNAL${filtered.length !== 1 ? 'S' : ''}`}
          </span>
        </div>
      </div>

      {/* ── Signal List ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">

        {loading && (
          <div className="flex flex-col gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center">
            <span className="text-investigation text-2xl block mb-3">●</span>
            <p className="text-white/30 text-[11px] font-mono uppercase tracking-widest">
              No signals match this filter
            </p>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col divide-y divide-white/5">
            {filtered.map((signal) => {
              const isOpen = expanded === signal._id;
              const hasDetail = !!(signal.threadText || signal.threadsUrl || signal.slug);

              return (
                <div key={signal._id} className="group">

                  {/* ── Signal Row ── */}
                  <div
                    className={`flex items-start gap-4 py-4 cursor-default ${
                      hasDetail ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => hasDetail && setExpanded(isOpen ? null : signal._id)}
                  >
                    {/* Dot */}
                    <div className="pt-[3px] flex-shrink-0">
                      <span className={`text-[13px] ${signal.threadsUrl || signal.threadText ? 'text-investigation' : 'text-white/20'}`}>
                        ●
                      </span>
                    </div>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-mono font-bold uppercase tracking-widest leading-snug transition-colors ${
                        hasDetail ? 'group-hover:text-white text-white/80' : 'text-white/50'
                      }`}>
                        {signal.title}
                      </p>
                    </div>

                    {/* Meta right */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {signal.slug && (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-investigation border border-investigation/30 px-2 py-0.5 hidden md:block">
                          DEEP DIVE ↗
                        </span>
                      )}
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest hidden md:block">
                        {formatDate(signal.publishedAt)}
                      </span>
                      {hasDetail && (
                        <span className={`text-white/30 text-[10px] font-mono transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                          ▾
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Expanded Panel ── */}
                  {isOpen && hasDetail && (
                    <div className="ml-7 mb-4 bg-black/40 border border-white/8 p-5 space-y-4">

                      {/* Date (mobile) */}
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest md:hidden">
                        {formatDate(signal.publishedAt)}
                      </p>

                      {/* Thread text */}
                      {signal.threadText && (
                        <p className="font-manrope text-[13px] text-white/60 leading-relaxed italic border-l-2 border-investigation/40 pl-4">
                          "{signal.threadText}"
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-1 flex-wrap">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/20">
                          Origin: Field_Analysis
                        </span>
                        <div className="flex items-center gap-4 ml-auto">
                          {signal.threadsUrl && (
                            <a
                              href={signal.threadsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                            >
                              <ThreadsIcon />
                              View Source ↗
                            </a>
                          )}
                          {signal.slug && (
                            <Link
                              to={`/article/${signal.slug}`}
                              className="text-[10px] font-mono font-black uppercase tracking-widest text-white hover:text-investigation transition-colors"
                            >
                              Read Deep Dive →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}