import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowDown } from 'lucide-react';
import { ClientLogo } from '../types.ts';
import { DESCRIPTOR_LINES, HERO_BG_VIDEO_URL, HERO_BG_POSTER_URL } from '../data/portfolio.ts';
import { euphoricSound } from '../utils/euphoricAudio.ts';

interface HeroProps {
  onOpenReel: () => void;
  onOpenBookCall: () => void;
  clientLogos: ClientLogo[];
  availabilityText?: string;
  bgVideoUrl?: string;
  bgPosterUrl?: string;
  reelVideoUrl?: string;
  posterUrl?: string;
  descriptorLines?: string[];
}

export const Hero: React.FC<HeroProps> = ({
  onOpenReel,
  onOpenBookCall,
  clientLogos,
  availabilityText = 'Available for select commissions',
  bgVideoUrl = HERO_BG_VIDEO_URL,
  bgPosterUrl = HERO_BG_POSTER_URL,
  reelVideoUrl,
  posterUrl,
  descriptorLines = DESCRIPTOR_LINES,
}) => {
  const activeVideoUrl = bgVideoUrl || reelVideoUrl || HERO_BG_VIDEO_URL;
  const activePosterUrl = bgPosterUrl || posterUrl || HERO_BG_POSTER_URL;
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [canAutoplayVideo, setCanAutoplayVideo] = useState(true);

  // Check prefers-reduced-motion or Save-Data
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const isSaveData = Boolean(nav.connection && nav.connection.saveData);

    if (motionQuery.matches || isSaveData) {
      setCanAutoplayVideo(false);
    }

    const handleMotion = (e: MediaQueryListEvent) => {
      setCanAutoplayVideo(!e.matches && !isSaveData);
    };
    motionQuery.addEventListener('change', handleMotion);

    return () => motionQuery.removeEventListener('change', handleMotion);
  }, []);

  // Unmount cleanup for audio
  useEffect(() => {
    return () => {
      euphoricSound.stop(0.4);
    };
  }, []);

  // Pause via IntersectionObserver when off-screen
  useEffect(() => {
    const video = videoRef.current;
    const heroEl = heroRef.current;
    if (!video || !heroEl || !canAutoplayVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay error handling
            });
            if (!isMuted) {
              euphoricSound.play();
            }
          } else {
            video.pause();
            if (!isMuted) {
              euphoricSound.stop(0.8);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [canAutoplayVideo, isMuted]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Keep raw video track muted so it doesn't clash with the euphoric soundscape
    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    if (!nextMuted) {
      euphoricSound.play();
    } else {
      euphoricSound.stop(1.2);
    }
  };

  const handleBookCall = () => {
    if (onOpenBookCall) {
      onOpenBookCall();
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden font-pilcrow-rounded"
      style={{ backgroundColor: 'var(--bg-deep)', fontFamily: "'Pilcrow Rounded', sans-serif" }}
      aria-label="Wachin Akura Motion Design Portfolio"
    >
      {/* Background Video / Poster */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {canAutoplayVideo ? (
          <video
            ref={videoRef}
            src={activeVideoUrl}
            poster={activePosterUrl}
            muted={isMuted}
            autoPlay
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center hero-video-enter scale-[1.01]"
            aria-hidden="true"
          />
        ) : (
          <img
            src={activePosterUrl}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        )}
        {/* Scrim: ensures contrast for navigation, headline and metadata while highlighting the motion cards */}
        <div className="absolute inset-0 hero-scrim pointer-events-none" />
      </div>

      {/* Top spacing for Nav */}
      <div className="h-20 w-full z-10" />

      {/* Middle Corner Meta (12px) */}
      <div className="relative z-10 w-full px-5 md:px-8 flex-1 flex items-center justify-between hero-meta-fade pointer-events-none">
        {/* Middle-left: 3-line descriptor (from data) */}
        <div className="flex flex-col space-y-1 micro-label text-[12px]">
          {descriptorLines.map((line, idx) => (
            <span key={idx} style={{ color: 'var(--text)' }}>
              {line}
            </span>
          ))}
          {availabilityText && (
            <span className="pt-2 text-[12px]" style={{ color: 'var(--muted)' }}>
              {availabilityText}
            </span>
          )}
          <a
            href="#works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 pt-2 text-[12px] font-medium pointer-events-auto hover:underline transition-colors"
            style={{ color: 'var(--accent)' }}
            aria-label="Jump directly to selected works"
          >
            <span>Explore selected works</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        {/* Middle-right: Creative direction & year (Desktop only) */}
        <div className="hidden md:flex flex-col items-end space-y-1 micro-label text-[12px]">
          <span style={{ color: 'var(--text)' }}>
            motion design & Animation
          </span>
          <span className="tabular-numbers text-[12px]" style={{ color: 'var(--muted)' }}>
            2026
          </span>
        </div>
      </div>

      {/* Bottom Content Area: Headline + Actions */}
      <div className="relative z-10 w-full px-5 md:px-8 pb-4 md:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Bottom-left: Headline */}
        <div className="max-w-[85%] md:max-w-[55%]">
          <h1
            className="font-hero text-[clamp(2.75rem,8vw,7.5rem)] font-bold tracking-[-0.03em] leading-[0.9] text-left overflow-hidden"
            style={{ fontFamily: "'Pilcrow Rounded', sans-serif", color: 'var(--text)' }}
          >
            <span className="headline-mask-item block">
              Motion that{' '}
              <span className="font-normal italic" style={{ fontFamily: "'Pilcrow Rounded', sans-serif" }}>
                earns its keep.
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom-right: CTAs & Sound toggle */}
        <div className="flex flex-wrap sm:flex-nowrap items-start md:items-center gap-3 sm:gap-4">
          {/* Direct prominent Work Explorer CTA */}
          <a
            href="#works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="min-h-[44px] px-5 inline-flex items-center justify-center space-x-2 text-[14px] font-semibold tracking-tight transition-all cursor-pointer rounded-[var(--radius)] w-full sm:w-auto text-center border border-hair hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--text)] bg-[var(--surface)]/85 hover:bg-[var(--surface)] backdrop-blur-md active:scale-[0.99] whitespace-nowrap shadow-md"
            id="hero-view-works-btn"
            aria-label="View portfolio works"
          >
            <span>View Works (6)</span>
            <ArrowDown className="w-4 h-4 text-[var(--accent)]" />
          </a>

          <button
            type="button"
            onClick={onOpenReel}
            className="min-h-[44px] px-5 inline-flex items-center justify-center text-[14px] font-semibold tracking-tight transition-all cursor-pointer rounded-[var(--radius)] w-full sm:w-auto text-center hover:opacity-90 active:scale-[0.99] whitespace-nowrap"
            style={{
              backgroundColor: '#1593FF',
              color: '#FFFFFF',
              border: 'none',
            }}
            id="hero-watch-reel-btn"
          >
            Watch the reel (1:45)
          </button>

          <button
            type="button"
            onClick={handleBookCall}
            className="btn-primary w-full sm:w-auto text-center px-5 min-h-[44px]"
            id="hero-start-project-btn"
          >
            Start a project
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="min-h-[44px] inline-flex items-center space-x-2 text-[13px] hover:opacity-80 transition-all cursor-pointer px-2.5 py-1 rounded-[var(--radius)] shrink-0"
            style={{
              color: isMuted ? 'var(--muted)' : 'var(--text)',
              backgroundColor: isMuted ? 'transparent' : 'var(--accent-soft)',
            }}
            aria-label={isMuted ? 'Turn euphoric sound on' : 'Turn sound off'}
            id="hero-sound-toggle-btn"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 opacity-75" aria-hidden="true" />
                <span className="underline underline-offset-4">Sound on</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                <span className="font-semibold text-xs tracking-wide hidden xl:inline">Sound: Euphoric Calm</span>
                <span className="flex items-end space-x-0.5 h-3.5 ml-1" aria-hidden="true">
                  <span className="w-0.5 bg-[var(--accent)] rounded-full wave-bar-1" />
                  <span className="w-0.5 bg-[var(--accent)] rounded-full wave-bar-2" />
                  <span className="w-0.5 bg-[var(--accent)] rounded-full wave-bar-3" />
                  <span className="w-0.5 bg-[var(--accent)] rounded-full wave-bar-4" />
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle interactive scroll-to-work cue right above the ticker */}
      <div className="relative z-10 w-full flex justify-center pb-2 pointer-events-auto">
        <a
          href="#works"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)]/85 hover:bg-[var(--surface)] backdrop-blur-md border border-hair text-[11px] uppercase tracking-wider text-[var(--text)] transition-all cursor-pointer group shadow-sm"
          aria-label="Scroll to portfolio works"
        >
          <span>Scroll to explore works</span>
          <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)] group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Thin Client Ticker inside frame, hairline top border */}
      <div
        className="relative z-10 w-full border-t border-hair py-3 overflow-hidden"
        style={{ backgroundColor: 'var(--ticker-bg)' }}
        aria-label="Client roster"
      >
        <div className="ticker-track flex items-center space-x-12 px-6">
          {[...clientLogos, ...clientLogos].map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex items-center space-x-12 whitespace-nowrap"
            >
              <span className="text-[12px] font-medium tracking-tight" style={{ color: 'var(--muted)' }}>
                {client.name}
              </span>
              <span className="inline-block w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--hair)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
