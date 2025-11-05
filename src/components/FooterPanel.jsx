import React from 'react';
import { Star } from 'lucide-react';

const FooterPanel = () => {
  return (
    <footer className="relative z-10 mx-auto mt-12 w-full max-w-5xl px-6 pb-12">
      <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-5 text-cyan-200/80 backdrop-blur">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-300" size={18} />
            <p className="text-sm">Antarmuka bertema luar angkasa futuristik — efek hologram & ambient glow.</p>
          </div>
          <p className="text-xs text-cyan-200/60">Built for demo purposes. Pastikan menghormati ketentuan layanan Instagram.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPanel;
