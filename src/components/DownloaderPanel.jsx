import React, { useState } from 'react';
import { Rocket, Download, Play, Image as ImageIcon } from 'lucide-react';

const neonInputBase =
  'w-full rounded-xl border border-cyan-400/30 bg-white/5 px-4 py-3 text-cyan-50 placeholder-cyan-200/50 shadow-[0_0_0_2px_rgba(34,211,238,0.15),0_0_24px_rgba(168,85,247,0.25)_inset] outline-none transition focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.35),0_0_32px_rgba(168,85,247,0.45)_inset]';

const API_POST = 'https://api.nekolabs.web.id/downloader/instagram?url=';
const API_STORY = 'https://api.nekolabs.web.id/downloader/instagram-story?username=';

const SpinnerPlanet = () => (
  <div className="my-10 flex flex-col items-center justify-center">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-cyan-400/40 border-t-fuchsia-500/80"></div>
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_6px_rgba(34,211,238,0.6)]" />
    </div>
    <p className="mt-4 text-cyan-100/80">Menyiapkan hyperdrive...</p>
    <style>{`
      .animate-spin-slow{animation:spin 2.2s linear infinite}
    `}</style>
  </div>
);

const GlitchError = ({ message }) => (
  <div className="relative mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
    <p className="glitch-text text-center text-sm md:text-base">{message}</p>
    <style>{`
      .glitch-text{position:relative}
      .glitch-text::before,.glitch-text::after{content:attr(data-text);position:absolute;left:0}
    `}</style>
  </div>
);

const MetaRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-lg bg-white/5 p-3 md:flex-row md:items-center md:justify-between">
    <span className="text-xs uppercase tracking-widest text-cyan-200/60">{label}</span>
    <span className="text-cyan-50/90">{String(value ?? '-')}
    </span>
  </div>
);

const ResultCard = ({ item }) => {
  const isVideo = item?.isVideo || item?.type === 'video';
  const mediaSrc = item?.downloadUrl || item?.url || '';
  const onMeteorClick = (e) => {
    const btn = e.currentTarget;
    btn.classList.add('meteor');
    setTimeout(() => btn.classList.remove('meteor'), 800);
  };
  return (
    <div className="group overflow-hidden rounded-2xl border border-cyan-400/20 bg-white/5 p-4 shadow-[0_0_40px_rgba(0,255,255,0.06)] backdrop-blur">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-cyan-400/20 bg-black/40">
        {isVideo ? (
          <video src={mediaSrc} controls className="h-full w-full" poster={item?.thumbnail || undefined} />
        ) : (
          <img src={mediaSrc} alt={item?.caption || 'preview'} className="h-full w-full object-contain" />
        )}
      </div>
      <div className="mt-4 grid gap-2">
        <MetaRow label="Username" value={item?.username || item?.owner || '-'} />
        <MetaRow label="Caption" value={item?.caption || '-'} />
        <div className="grid grid-cols-2 gap-2">
          <MetaRow label="Likes" value={item?.likes} />
          <MetaRow label="Comments" value={item?.comments} />
        </div>
        <MetaRow label="isVideo" value={isVideo ? 'true' : 'false'} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={mediaSrc}
          download
          onClick={onMeteorClick}
          className="relative inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:border-cyan-300 hover:bg-cyan-500/20 hover:shadow-[0_0_36px_rgba(34,211,238,0.45)]"
        >
          <Download size={18} />
          <span>Download</span>
          <span className="pointer-events-none absolute -left-10 top-1/2 hidden -translate-y-1/2 skew-x-12 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/60 to-cyan-400/0 px-8 py-[1px] text-transparent shadow-[0_0_24px_8px_rgba(217,70,239,0.4)] group-[.meteor]:block"/>
        </a>
      </div>
      <style>{`
        .meteor .group-\[\.meteor\]\:block{display:block}
      `}</style>
    </div>
  );
};

const DownloaderPanel = () => {
  const [mode, setMode] = useState('post'); // 'post' or 'story'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const fetchData = async () => {
    setError('');
    setResults([]);
    if (!query.trim()) {
      setError('Masukkan URL Instagram atau username.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === 'post' ? `${API_POST}${encodeURIComponent(query.trim())}` : `${API_STORY}${encodeURIComponent(query.trim())}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Gagal menghubungkan hyperrelay.');
      const data = await res.json();
      // Normalize to an array of items with common fields
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data?.result) {
        if (Array.isArray(data.result)) items = data.result;
        else items = [data.result];
      } else if (data?.data) {
        items = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data) {
        items = [data];
      }

      // map to unified structure
      items = items.map((it) => ({
        username: it.username || it.owner || it.user || it.author,
        caption: it.caption || it.title || it.description,
        likes: it.like_count || it.likes || it.like || it.favorites,
        comments: it.comment_count || it.comments,
        isVideo: it.isVideo ?? (it.type ? it.type.includes('video') : undefined),
        downloadUrl: it.downloadUrl || it.url || it.media || it.link,
        thumbnail: it.thumbnail || it.thumbnailUrl || it.preview,
        type: it.type,
      })).filter((it) => it.downloadUrl);

      if (!items.length) throw new Error('Tidak ada media yang dapat diunduh ditemukan.');
      setResults(items);
    } catch (err) {
      setError(err.message || 'Terjadi masalah di ruang angkasa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 -mt-16 mx-auto w-full max-w-5xl px-6">
      <div className="rounded-2xl border border-cyan-400/20 bg-white/10 p-5 shadow-[0_0_60px_rgba(59,130,246,0.08),inset_0_0_40px_rgba(168,85,247,0.08)] backdrop-blur">
        <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-cyan-100">
            <Rocket className="text-cyan-300" />
            <span className="text-sm uppercase tracking-widest text-cyan-200/70">Hyper Panel</span>
          </div>
          <div className="inline-flex overflow-hidden rounded-xl border border-cyan-400/30 bg-white/5 p-1 text-sm">
            <button
              onClick={() => setMode('post')}
              className={`${mode==='post'?'bg-cyan-500/20 text-cyan-50 shadow-[inset_0_0_18px_rgba(34,211,238,0.35)]':'text-cyan-200/70'} rounded-lg px-3 py-1.5 transition`}
            >Post/Reel</button>
            <button
              onClick={() => setMode('story')}
              className={`${mode==='story'?'bg-fuchsia-500/20 text-cyan-50 shadow-[inset_0_0_18px_rgba(217,70,239,0.35)]':'text-cyan-200/70'} rounded-lg px-3 py-1.5 transition`}
            >Story</button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode==='post' ? 'Tempel URL post/reel Instagram...' : 'Masukkan username untuk Story...'}
            className={neonInputBase}
          />
          <button
            onClick={fetchData}
            className="group inline-flex items-center justify-center rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/20 px-5 py-3 text-cyan-50 shadow-[0_0_22px_rgba(217,70,239,0.25),inset_0_0_24px_rgba(34,211,238,0.12)] transition hover:border-fuchsia-300 hover:shadow-[0_0_36px_rgba(217,70,239,0.45),inset_0_0_26px_rgba(34,211,238,0.18)]"
          >
            <span className="mr-2">Download</span>
            {mode==='post' ? <Play size={18} className="opacity-80"/> : <ImageIcon size={18} className="opacity-80"/>}
          </button>
        </div>

        {loading && <SpinnerPlanet />}
        {error && (
          <div className="mt-4 animate-glitch rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-200">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {results.map((item, idx) => (
              <ResultCard key={idx} item={item} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .animate-glitch{animation:glitch 1s steps(2,end) 3}
        @keyframes glitch{0%{filter:none}20%{filter:hue-rotate(10deg) saturate(130%)}40%{transform:translateX(-1px)}60%{transform:translateX(1px)}80%{filter:contrast(120%)}100%{filter:none;transform:none}}
      `}</style>
    </section>
  );
};

export default DownloaderPanel;
