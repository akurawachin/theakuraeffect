import React, { useState, useRef } from 'react';
import { Nav } from './components/Nav.tsx';
import { Hero } from './components/Hero.tsx';
import { WorksIndex } from './components/WorksIndex.tsx';
import { ProjectDetail } from './components/ProjectDetail.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { BookCallModal } from './components/BookCallModal.tsx';
import { ReelModal } from './components/ReelModal.tsx';
import {
  PROJECTS,
  CLIENT_LOGOS,
  HERO_BG_VIDEO_URL,
  HERO_BG_POSTER_URL,
  REEL_VIDEO_URL,
  REEL_POSTER_URL,
  DESCRIPTOR_LINES,
} from './data/portfolio.ts';
import { ProjectItem } from './types.ts';
import { useTheme } from './utils/useTheme.ts';
import { Preloader } from './components/Preloader.tsx';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);
  const [isReelOpen, setIsReelOpen] = useState(false);
  const bookCallTriggerRef = useRef<HTMLElement | null>(null);

  const handleSelectProject = (project: ProjectItem) => {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => {
        setSelectedProject(project);
      });
    } else {
      setSelectedProject(project);
    }
  };

  const handleBackFromDetail = () => {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => {
        setSelectedProject(null);
      });
    } else {
      setSelectedProject(null);
    }
  };

  const handleNextProject = () => {
    if (!selectedProject || PROJECTS.length === 0) return;
    const currentIndex = PROJECTS.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    handleSelectProject(PROJECTS[nextIndex]);
  };

  const nextProjectTitle = (() => {
    if (!selectedProject || PROJECTS.length === 0) return 'Next project';
    const currentIndex = PROJECTS.findIndex((p) => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    return PROJECTS[nextIndex].title;
  })();

  const handleOpenBookCall = (e?: React.MouseEvent) => {
    if (e?.currentTarget) {
      bookCallTriggerRef.current = e.currentTarget as HTMLElement;
    }
    setIsBookCallOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (selectedProject) {
      setSelectedProject(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Intro Preloader animation (plays once on first load) */}
      <Preloader />

      {/* Top Navigation */}
      <Nav
        onOpenBookCall={() => handleOpenBookCall()}
        onNavigateSection={handleNavigateSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="w-full flex-1">
        {selectedProject ? (
          /* Project Detail View */
          <ProjectDetail
            project={selectedProject}
            onBack={handleBackFromDetail}
            onNextProject={handleNextProject}
            nextProjectTitle={nextProjectTitle}
          />
        ) : (
          /* Main Portfolio Flow */
          <>
            {/* Full-bleed Hero with custom reference showcase background */}
            <Hero
              onOpenReel={() => setIsReelOpen(true)}
              onOpenBookCall={() => handleOpenBookCall()}
              clientLogos={CLIENT_LOGOS}
              availabilityText="Available for select commissions Q4 / 2026"
              bgVideoUrl={HERO_BG_VIDEO_URL}
              bgPosterUrl={HERO_BG_POSTER_URL}
              reelVideoUrl={REEL_VIDEO_URL}
              posterUrl={HERO_BG_POSTER_URL}
              descriptorLines={DESCRIPTOR_LINES}
            />

            {/* Works Archive / Grid / List */}
            <WorksIndex
              projects={PROJECTS}
              onSelectProject={handleSelectProject}
            />

            {/* About & Practice Section */}
            <AboutSection
              onStartProject={() => handleOpenBookCall()}
            />

            {/* Contact & Studio Inquiry Section */}
            <ContactSection
              onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </>
        )}
      </main>

      {/* Book Call Dialog Modal */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
        triggerRef={bookCallTriggerRef}
      />

      {/* Cinema Reel Modal */}
      <ReelModal
        isOpen={isReelOpen}
        onClose={() => setIsReelOpen(false)}
        videoUrl={REEL_VIDEO_URL}
        posterUrl={REEL_POSTER_URL}
      />
    </div>
  );
}
