import React from 'react';
import SpaceBackground from './components/SpaceBackground';
import HeroCover from './components/HeroCover';
import DownloaderPanel from './components/DownloaderPanel';
import FooterPanel from './components/FooterPanel';

const App = () => {
  return (
    <div className="min-h-screen text-white selection:bg-fuchsia-500/30 selection:text-white">
      {/* Space-grade animated background */}
      <SpaceBackground />

      {/* 3D Spline hero cover */}
      <HeroCover />

      {/* Core downloader panel */}
      <DownloaderPanel />

      {/* Footer */}
      <FooterPanel />

      {/* Global keyframes for float/fade utilities */}
      <style>{`
        .float{animation:float 6s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>
    </div>
  );
};

export default App;
