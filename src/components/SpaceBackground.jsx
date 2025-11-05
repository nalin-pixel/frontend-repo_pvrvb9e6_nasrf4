import React, { useEffect, useRef } from 'react';

// Canvas starfield background with subtle parallax
const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.min(250, Math.floor((canvas.width * canvas.height) / 12000));
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.2 + 0.2,
      }));
    };

    let t = 0;
    const draw = () => {
      t += 0.0015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // cosmic gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#06091b');
      grad.addColorStop(1, '#0b0f2a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // stars
      starsRef.current.forEach((s) => {
        const twinkle = 0.3 + Math.sin(t * 6 + s.x * 0.01) * 0.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * twinkle, 0, Math.PI * 2);
        const hue = 200 + s.z * 60; // bluish to purple
        ctx.fillStyle = `hsla(${hue}, 90%, ${70 - s.z * 20}%, ${0.8})`;
        ctx.fill();
        // slow drift
        s.x += 0.02 * s.z;
        s.y += 0.015 * s.z;
        if (s.x > canvas.width) s.x = 0;
        if (s.y > canvas.height) s.y = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgba(0,255,255,0.10),transparent),radial-gradient(50%_35%_at_80%_90%,rgba(255,0,255,0.10),transparent)]" />
    </div>
  );
};

export default SpaceBackground;
