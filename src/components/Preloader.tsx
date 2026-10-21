import React, { useState, useEffect } from 'react';

const PRELOADER_KEY = 'wachin_portfolio_intro_seen';

interface PreloaderProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, forceShow = false }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if user already saw intro in this session (unless forced)
    const hasSeen = sessionStorage.getItem(PRELOADER_KEY);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeen && !forceShow) {
      if (onComplete) onComplete();
      return;
    }

    if (prefersReducedMotion && !forceShow) {
      sessionStorage.setItem(PRELOADER_KEY, 'true');
      if (onComplete) onComplete();
      return;
    }

    setShouldRender(true);

    // Prevent body scroll during intro
    document.body.style.overflow = 'hidden';

    // Animate progress smoothly from 0 to 100 over ~1.3 seconds
    const duration = 1350;
    const startTime = performance.now();
    let rafId: number;

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Fast ease-out cubic
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      const currentPct = Math.round(eased * 100);
      setProgress(currentPct);

      if (progressRatio < 1) {
        rafId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
        // Brief pause at 100% before sliding out
        setTimeout(() => {
          setIsExiting(true);
          sessionStorage.setItem(PRELOADER_KEY, 'true');

          // After slide-out transition finishes (700ms), unlock body & finish
          setTimeout(() => {
            document.body.style.overflow = '';
            setShouldRender(false);
            if (onComplete) onComplete();
          }, 700);
        }, 160);
      }
    };

    rafId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = '';
    };
  }, [forceShow, onComplete]);

  // Click or Escape to skip immediately
  const handleSkip = () => {
    setIsExiting(true);
    sessionStorage.setItem(PRELOADER_KEY, 'true');
    setTimeout(() => {
      document.body.style.overflow = '';
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 400);
  };

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <aside
      role="dialog"
      aria-label="Portfolio introductory loading screen"
      aria-modal="true"
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col justify-between items-center px-6 py-8 md:py-10 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] cursor-pointer select-none overflow-hidden ${
        isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
      style={{
        backgroundColor: '#0A0A0A',
        color: '#EDEDED',
      }}
    >
      {/* Top Header metadata */}
      <div className="w-full max-w-6xl flex items-center justify-between text-[12px] micro-label z-20 opacity-80">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          <span className="tracking-widest uppercase font-semibold text-white/90">Wachin Akura</span>
        </div>
        <span className="tabular-numbers text-white/60">Portfolio · 2026</span>
      </div>

      {/* Center: Reference Concentric Circles + Centered Logo */}
      <div className="relative w-full flex-1 flex items-center justify-center my-auto">
        {/* Concentric Circle 5: Outermost atmospheric radar wave */}
        <div
          className="absolute rounded-full pointer-events-none transition-transform duration-700 ease-out"
          style={{
            width: 'clamp(580px, 88vw, 1150px)',
            height: 'clamp(580px, 88vw, 1150px)',
            border: '1.5px solid rgba(255, 125, 181, 0.22)',
            transform: `scale(${0.92 + (progress / 100) * 0.12})`,
          }}
        />

        {/* Concentric Circle 4: Large vivid circular boundary */}
        <div
          className="absolute rounded-full pointer-events-none transition-transform duration-500 ease-out animate-concentric-2"
          style={{
            width: 'clamp(420px, 64vw, 840px)',
            height: 'clamp(420px, 64vw, 840px)',
            border: '2px solid rgba(255, 125, 181, 0.45)',
            boxShadow: '0 0 25px rgba(255, 125, 181, 0.12), inset 0 0 25px rgba(255, 125, 181, 0.08)',
          }}
        />

        {/* Concentric Circle 3: Prominent vivid neon ring (exact reference match) */}
        <div
          className="absolute rounded-full pointer-events-none transition-transform duration-300 ease-out animate-concentric-1"
          style={{
            width: 'clamp(270px, 42vw, 540px)',
            height: 'clamp(270px, 42vw, 540px)',
            border: '2.5px solid #FF7DB5',
            boxShadow: '0 0 35px rgba(255, 125, 181, 0.35), inset 0 0 20px rgba(255, 125, 181, 0.2)',
          }}
        />

        {/* Concentric Circle 2: Inner boundary ring around the central mark */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 'clamp(140px, 22vw, 260px)',
            height: 'clamp(140px, 22vw, 260px)',
            border: '1.5px solid rgba(255, 125, 181, 0.55)',
            backgroundColor: 'rgba(255, 125, 181, 0.03)',
          }}
        />

        {/* Concentric Circle 1: Tight halo circle */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 'clamp(90px, 14vw, 150px)',
            height: 'clamp(90px, 14vw, 150px)',
            border: '1px solid rgba(255, 125, 181, 0.25)',
          }}
        />

        {/* Soft Ambient Center Glow */}
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40 transition-opacity duration-300"
          style={{
            backgroundColor: 'var(--accent)',
            transform: `scale(${0.8 + (progress / 100) * 0.3})`,
          }}
        />

        {/* Center: Signature Logo Mark + Top-right Accent Dot (Like the reference "B°") */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          <div
            className="relative flex items-center justify-center transition-all duration-300 animate-logo-glow"
            style={{
              transform: `scale(${0.92 + (progress / 100) * 0.12})`,
            }}
          >
            {/* The Logo */}
            <img
              src="/assets/aistudio/My_Logo_0ba1d67d.svg"
              alt="Wachin Akura logo mark"
              className="w-16 md:w-20 lg:w-24 h-auto object-contain filter drop-shadow-[0_0_16px_rgba(255,125,181,0.6)]"
            />

            {/* Accent dot at top-right (matching reference B° styling) */}
            <div
              className="absolute -top-1.5 -right-3 md:-right-4 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-dot-pulse"
              style={{
                backgroundColor: '#FF7DB5',
                boxShadow: '0 0 12px #FF7DB5, 0 0 24px rgba(255, 125, 181, 0.8)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer metadata & smooth progress counter */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-[12px] micro-label z-20 gap-3">
        <div className="text-white/60 tracking-wider">
          <span>Character Animation & 2D Motion</span>
        </div>

        {/* Center/Right Counter */}
        <div className="flex items-center space-x-3">
          <div className="w-24 h-[1px] bg-white/20 overflow-hidden relative rounded-full">
            <div
              className="h-full transition-all duration-75 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 8px var(--accent)',
              }}
            />
          </div>
          <span className="tabular-numbers font-mono font-medium text-[13px] text-white">
            {progress}%
          </span>
        </div>

        <div className="text-white/40 text-[11px] hidden sm:block">
          <span>Click anywhere to skip</span>
        </div>
      </div>
    </aside>
  );
};
