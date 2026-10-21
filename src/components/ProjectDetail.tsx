import React, { useEffect, useState } from 'react';
import { ProjectItem } from '../types.ts';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailProps {
  project: ProjectItem;
  onBack: () => void;
  onNextProject: () => void;
  nextProjectTitle?: string;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onNextProject,
  nextProjectTitle = 'Next project',
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project.id]);

  // Handle lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null || !project.gallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : project.gallery!.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! < project.gallery!.length - 1 ? prev! + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, project.gallery]);

  const galleryItems = project.gallery || [];
  const mainVideo = galleryItems.find((item) => item.type === 'video');
  const stills = galleryItems.filter((item) => item.type === 'image');

  return (
    <article
      id="project-detail"
      className="w-full min-h-screen px-5 md:px-8 py-12 md:py-20"
      style={{ backgroundColor: 'var(--bg)' }}
      aria-label={`${project.title} case study`}
    >
      {/* Back button top bar */}
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text)' }}
          aria-label="Back to all works"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to works</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <img
            src="/assets/aistudio/My_Logo_0ba1d67d.svg"
            alt="Wachin Akura logo"
            className="h-4 md:h-5 w-auto"
          />
          <span className="micro-label tabular-numbers text-[12px]">
            ({project.number})
          </span>
        </div>
      </div>

      {/* Split layout:
          Desktop: Left 5 cols sticky --paper panel, Right 7 cols media stack
          Mobile: Media first, panel below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* MEDIA STACK (Right on desktop, First on mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col space-y-12">
          {/* Main Video */}
          {mainVideo ? (
            <div className="w-full flex flex-col space-y-2">
              <div className="relative w-full aspect-[16/9] bg-[var(--bg-deep)] rounded-[var(--radius)] overflow-hidden">
                <video
                  src={mainVideo.url}
                  poster={project.posterUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  Your browser does not support HTML video.
                </video>
              </div>
              {mainVideo.caption && (
                <p className="micro-label text-[12px] pt-1" style={{ color: 'var(--muted)' }}>
                  {mainVideo.caption}
                </p>
              )}
            </div>
          ) : project.previewVideoUrl ? (
            <div className="w-full flex flex-col space-y-2">
              <div className="relative w-full aspect-[16/9] bg-[var(--bg-deep)] rounded-[var(--radius)] overflow-hidden">
                <video
                  src={project.previewVideoUrl}
                  poster={project.posterUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  Your browser does not support HTML video.
                </video>
              </div>
            </div>
          ) : null}

          {/* Stills stack with (1/5) counter beneath */}
          {stills.length > 0 ? (
            stills.map((still, idx) => {
              const galleryOverallIndex = galleryItems.indexOf(still);
              return (
                <div key={idx} className="w-full flex flex-col space-y-2">
                  <div
                    className="relative w-full aspect-[16/10] bg-[var(--bg-deep)] rounded-[var(--radius)] overflow-hidden cursor-zoom-in group"
                    onClick={() => setLightboxIndex(galleryOverallIndex)}
                  >
                    <img
                      src={still.url}
                      alt={still.caption || `${project.title} frame ${idx + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-95"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-between micro-label text-[12px] pt-1">
                    <span style={{ color: 'var(--muted)' }}>{still.caption}</span>
                    <span className="tabular-numbers" style={{ color: 'var(--muted)' }}>
                      ({idx + 1}/{stills.length})
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            /* Fallback single poster if no stills defined */
            <div className="w-full flex flex-col space-y-2">
              <div className="relative w-full aspect-[16/10] bg-[var(--bg-deep)] rounded-[var(--radius)] overflow-hidden">
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center justify-end micro-label text-[12px] pt-1">
                <span className="tabular-numbers" style={{ color: 'var(--muted)' }}>(1/1)</span>
              </div>
            </div>
          )}
        </div>

        {/* LEFT STICKY --PAPER PANEL (Left on desktop, Second on mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-5 lg:sticky lg:top-8">
          <div className="panel-paper p-6 md:p-8 rounded-[var(--radius)] shadow-xl flex flex-col space-y-6">
            {/* Header row in paper panel */}
            <div className="flex items-baseline justify-between border-b border-paper-hair pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-[12px] font-medium" style={{ color: 'var(--paper-muted)' }}>
                  {project.service}
                </span>
                {project.badge && (
                  <span
                    className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[var(--radius)]"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--paper-ink)',
                    }}
                  >
                    {project.badge}
                  </span>
                )}
              </div>
              <span className="tabular-numbers text-[12px] font-medium" style={{ color: 'var(--paper-muted)' }}>
                ({project.number})
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-[clamp(2.25rem,4.5vw,4.5rem)] leading-[0.9] tracking-[-0.04em]">
              {project.title}
            </h2>

            {/* Data rows separated by --paper-hair */}
            <div className="flex flex-col text-[14px]">
              {/* Description */}
              {project.description && (
                <div className="py-4 border-b border-paper-hair">
                  <span className="block text-[12px] mb-1.5" style={{ color: 'var(--paper-muted)' }}>
                    Description
                  </span>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--paper-ink)' }}>
                    {project.description}
                  </p>
                </div>
              )}

              {/* Services */}
              {project.services && project.services.length > 0 && (
                <div className="py-4 border-b border-paper-hair">
                  <span className="block text-[12px] mb-1.5" style={{ color: 'var(--paper-muted)' }}>
                    Services
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((srv, i) => (
                      <span key={i} className="text-[14px]" style={{ color: 'var(--paper-ink)' }}>
                        {srv}{i < project.services!.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client */}
              {project.client && (
                <div className="py-4 border-b border-paper-hair flex items-baseline justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                    Client
                  </span>
                  <span className="font-medium text-right" style={{ color: 'var(--paper-ink)' }}>
                    {project.client}
                  </span>
                </div>
              )}

              {/* Event */}
              {project.event && (
                <div className="py-4 border-b border-paper-hair flex items-baseline justify-between gap-4">
                  <span className="text-[12px] shrink-0" style={{ color: 'var(--paper-muted)' }}>
                    Event
                  </span>
                  <span className="font-medium text-right" style={{ color: 'var(--paper-ink)' }}>
                    {project.event}
                  </span>
                </div>
              )}

              {/* Venue / Placement */}
              {project.venue && (
                <div className="py-4 border-b border-paper-hair flex items-baseline justify-between gap-4">
                  <span className="text-[12px] shrink-0" style={{ color: 'var(--paper-muted)' }}>
                    Placement
                  </span>
                  <span className="font-medium text-right" style={{ color: 'var(--paper-ink)' }}>
                    {project.venue}
                  </span>
                </div>
              )}

              {/* Year */}
              {project.year && (
                <div className="py-4 border-b border-paper-hair flex items-baseline justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                    Year
                  </span>
                  <span className="tabular-numbers font-medium" style={{ color: 'var(--paper-ink)' }}>
                    {project.year}
                  </span>
                </div>
              )}

              {/* Tools */}
              {project.tools && project.tools.length > 0 && (
                <div className="py-4 border-b border-paper-hair flex items-baseline justify-between">
                  <span className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                    Tools
                  </span>
                  <span className="text-[14px]" style={{ color: 'var(--paper-ink)' }}>
                    {project.tools.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Next project large text link */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={onNextProject}
                className="min-h-[44px] text-left group inline-flex flex-col cursor-pointer"
                aria-label={`Go to next project: ${nextProjectTitle}`}
              >
                <span className="text-[12px] flex items-center space-x-1" style={{ color: 'var(--paper-muted)' }}>
                  <span>Next project</span>
                  <span className="text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-1 font-mono">→</span>
                </span>
                <span
                  className="font-display text-2xl tracking-tight group-hover:text-[var(--accent)] transition-colors duration-200"
                  style={{ color: 'var(--paper-ink)' }}
                >
                  {nextProjectTitle}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)' }}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm"
            style={{ color: 'var(--text)' }}
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : galleryItems.length - 1))
            }
            className="absolute left-4 md:left-8 min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: 'var(--text)' }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={galleryItems[lightboxIndex].url}
              alt={galleryItems[lightboxIndex].caption || 'Lightbox view'}
              className="max-h-[75vh] w-auto object-contain rounded-[var(--radius)]"
              referrerPolicy="no-referrer"
            />
            {galleryItems[lightboxIndex].caption && (
              <p className="micro-label text-center pt-4 text-[13px]" style={{ color: 'var(--text)' }}>
                {galleryItems[lightboxIndex].caption}
              </p>
            )}
            <span className="micro-label tabular-numbers pt-1" style={{ color: 'var(--muted)' }}>
              ({lightboxIndex + 1} of {galleryItems.length})
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setLightboxIndex((prev) => (prev! < galleryItems.length - 1 ? prev! + 1 : 0))
            }
            className="absolute right-4 md:right-8 min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ color: 'var(--text)' }}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </article>
  );
};
