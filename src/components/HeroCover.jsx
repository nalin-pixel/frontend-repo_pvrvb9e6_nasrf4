import React from 'react';
import Spline from '@splinetool/react-spline';

const HeroCover = () => {
  return (
    <section className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/0CT1-dbOQTa-XJKt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Ambient holographic gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050715]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <h1 className="animate-fadeInUp bg-gradient-to-r from-cyan-300 via-blue-200 to-fuchsia-300 bg-clip-text font-extrabold text-4xl leading-tight text-transparent md:text-5xl">
          InstaSpace Downloader
        </h1>
        <p className="mt-3 animate-fadeInUp animation-delay-200 text-cyan-100/90 md:text-lg">
          Unduh foto, reel, dan story Instagram dalam nuansa antarmuka kapal luar angkasa futuristik.
        </p>
      </div>

      <style>{`
        .animate-fadeInUp{animation:fadeInUp .9s ease both}
        .animation-delay-200{animation-delay:.2s}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </section>
  );
};

export default HeroCover;
