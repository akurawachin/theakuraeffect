import React, { useState, useEffect, useRef } from 'react';
import { ThemeSwitch } from './ThemeSwitch.tsx';
import { Theme } from '../utils/useTheme.ts';

interface NavProps {
  onOpenBookCall: () => void;
  onNavigateSection?: (sectionId: string) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
}

export const Nav: React.FC<NavProps> = ({
  onOpenBookCall,
  onNavigateSection,
  theme = 'dark',
  onToggleTheme = () => {},
}) => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [watTime, setWatTime] = useState('');

  const lastScrollYRef = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // West Africa Time (WAT) - Africa/Lagos (UTC+1)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          second: mediaQuery.matches ? undefined : '2-digit',
          hour12: false,
        });
        setWatTime(formatter.format(new Date()));
      } catch {
        const d = new Date();
        const hrs = String(d.getUTCHours() + 1).padStart(2, '0');
        const mins = String(d.getUTCMinutes()).padStart(2, '0');
        const secs = String(d.getUTCSeconds()).padStart(2, '0');
        setWatTime(mediaQuery.matches ? `${hrs}:${mins}` : `${hrs}:${mins}:${secs}`);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      clearInterval(interval);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Scroll detection: transparent over hero, fixed with solid var(--bg) after hero, hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroHeight = window.innerHeight * 0.85;

      setIsScrolledPastHero(currentY > heroHeight);

      if (currentY <= heroHeight) {
        setIsVisible(true);
      } else {
        if (currentY > lastScrollYRef.current + 10) {
          // Scrolling down
          setIsVisible(false);
        } else if (currentY < lastScrollYRef.current - 10) {
          // Scrolling up
          setIsVisible(true);
        }
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus trap and escape listener for mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  const navClass = isScrolledPastHero
    ? `fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } border-b border-hair`
    : 'absolute top-0 left-0 right-0 z-40';

  const navBg = isScrolledPastHero
    ? { backgroundColor: 'var(--bg)' }
    : { backgroundColor: 'transparent' };

  return (
    <>
      <header
        id="main-nav"
        className={navClass}
        style={navBg}
        role="banner"
      >
        <div className="w-full px-5 md:px-8 py-4 md:py-6 flex items-center justify-between text-sm">
          {/* Column 1: Logo + Name */}
          <div className="flex items-center">
            <a
              href="#top"
              onClick={(e) => handleNavClick(e, 'top')}
              className="text-[15px] md:text-base font-medium tracking-tight hover:opacity-80 transition-opacity flex items-center space-x-2.5 group"
              style={{ color: 'var(--text)' }}
            >
              <img
                src="/assets/aistudio/My_Logo_0ba1d67d.svg"
                alt="Wachin Akura mark"
                className="h-5 md:h-[22px] w-auto transition-transform duration-200 group-hover:scale-105"
              />
              <span>Wachin Akura</span>
            </a>
          </div>

          {/* Column 2: Live WAT time (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 micro-label">
            <span className="sr-only">West Africa Time (WAT)</span>
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            <span aria-hidden="true" className="tabular-numbers text-[13px]" style={{ color: 'var(--muted)' }}>
              WAT {watTime || '12:00:00'}
            </span>
          </div>

          {/* Column 3: Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-[13px]" aria-label="Main Navigation">
            <a
              href="#works"
              onClick={(e) => handleNavClick(e, 'works')}
              className="hover:opacity-80 transition-opacity flex items-center space-x-1.5 font-medium"
              style={{ color: 'var(--text)' }}
            >
              <span>Works</span>
              <span className="text-[11px] tabular-numbers" style={{ color: 'var(--accent)' }}>
                (6)
              </span>
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text)' }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text)' }}
            >
              Contact
            </a>
          </nav>

          {/* Column 4: Theme switcher & Start a project button (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={onOpenBookCall}
              className="link-secondary text-[13px]"
              aria-label="Start a project"
            >
              Start a project
            </button>
          </div>

          {/* Mobile Actions: Theme Switch + Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[14px] font-medium"
              style={{ color: 'var(--text)' }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-overlay"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Overlay */}
      {menuOpen && (
        <div
          id="mobile-menu-overlay"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 flex flex-col justify-between p-6"
          style={{ backgroundColor: 'var(--bg)' }}
        >
          <div className="flex items-center justify-between border-b border-hair pb-4">
            <div className="flex items-center space-x-2.5">
              <img
                src="/assets/aistudio/My_Logo_0ba1d67d.svg"
                alt="Wachin Akura mark"
                className="h-6 w-auto"
              />
              <span className="font-medium text-base" style={{ color: 'var(--text)' }}>
                Wachin Akura
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-end text-sm underline"
              style={{ color: 'var(--text)' }}
            >
              Close
            </button>
          </div>

          <nav className="flex flex-col space-y-6 my-auto" aria-label="Mobile links">
            <a
              href="#works"
              onClick={(e) => handleNavClick(e, 'works')}
              className="font-display text-4xl tracking-tight hover:opacity-80 flex items-baseline justify-between"
              style={{ color: 'var(--text)' }}
            >
              <span>Works</span>
              <span className="text-2xl tabular-numbers font-normal" style={{ color: 'var(--accent)' }}>
                (6)
              </span>
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="font-display text-4xl tracking-tight hover:opacity-80"
              style={{ color: 'var(--text)' }}
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="font-display text-4xl tracking-tight hover:opacity-80"
              style={{ color: 'var(--text)' }}
            >
              Contact
            </a>
          </nav>

          <div className="border-t border-hair pt-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="micro-label" style={{ color: 'var(--muted)' }}>Theme</span>
              <ThemeSwitch theme={theme} onToggle={onToggleTheme} variant="segmented" />
            </div>

            <div className="flex items-center space-x-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span className="tabular-numbers">WAT {watTime}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenBookCall();
              }}
              className="btn-primary w-full text-center"
            >
              Start a project
            </button>
          </div>
        </div>
      )}
    </>
  );
};
