import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  LayoutGrid,
  LayoutList,
  GalleryHorizontal,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { ProjectItem, ViewMode } from '../types.ts';

interface WorksIndexProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export const WorksIndex: React.FC<WorksIndexProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedService, setSelectedService] = useState<string>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeArchiveIndex, setActiveArchiveIndex] = useState<number>(0);
  const [wipeKey, setWipeKey] = useState<number>(0);

  // Dropdown menus state
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(target)) {
        setIsServiceOpen(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(target)) {
        setIsViewOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsServiceOpen(false);
        setIsViewOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Floating cursor preview in List view
  const floatingPreviewRef = useRef<HTMLDivElement>(null);
  const [floatingProject, setFloatingProject] = useState<ProjectItem | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Swipe detection for Archive view
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Available services derived from projects
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      counts[p.service] = (counts[p.service] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const serviceList = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.service)));
    return ['All', ...unique];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedService === 'All') return projects;
    return projects.filter((p) => p.service === selectedService);
  }, [projects, selectedService]);

  // Ensure activeArchiveIndex stays in bounds when filters change
  useEffect(() => {
    if (activeArchiveIndex >= filteredProjects.length) {
      setActiveArchiveIndex(0);
    }
  }, [filteredProjects.length, activeArchiveIndex]);

  // Archive view change with 350ms wipe
  const changeArchiveProject = useCallback((newIndex: number) => {
    if (filteredProjects.length === 0) return;
    const count = filteredProjects.length;
    const wrapped = (newIndex % count + count) % count;
    setActiveArchiveIndex(wrapped);
    setWipeKey((k) => k + 1);
  }, [filteredProjects.length]);

  // Keyboard navigation for archive view
  useEffect(() => {
    if (viewMode !== 'archive') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack if inside inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeArchiveProject(activeArchiveIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeArchiveProject(activeArchiveIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeArchiveIndex, changeArchiveProject]);

  // Floating cursor animation loop (requestAnimationFrame with translate3d)
  const updateCursorPosition = useCallback(() => {
    if (!floatingPreviewRef.current) return;
    const pos = mousePosRef.current;
    
    // Smooth lerp or direct clamping inside viewport
    pos.x += (pos.targetX - pos.x) * 0.25;
    pos.y += (pos.targetY - pos.y) * 0.25;

    const previewWidth = 320;
    const previewHeight = 240; // 4:3 landscape ratio (320x240)
    const offset = 20;

    let posX = pos.x + offset;
    let posY = pos.y + offset;

    // Viewport clamping
    if (posX + previewWidth > window.innerWidth - 20) {
      posX = pos.x - previewWidth - offset;
    }
    if (posY + previewHeight > window.innerHeight - 20) {
      posY = pos.y - previewHeight - offset;
    }

    floatingPreviewRef.current.style.transform = `translate3d(${Math.round(posX)}px, ${Math.round(posY)}px, 0)`;

    rafIdRef.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePosRef.current.targetX = e.clientX;
    mousePosRef.current.targetY = e.clientY;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(updateCursorPosition);
    }
  }, [updateCursorPosition]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Touch swipe handling for archive viewer
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // swipe left -> next
        changeArchiveProject(activeArchiveIndex + 1);
      } else {
        // swipe right -> prev
        changeArchiveProject(activeArchiveIndex - 1);
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const activeProject = filteredProjects[activeArchiveIndex] || null;

  return (
    <section
      id="works"
      className="w-full px-5 md:px-8 py-20 md:py-32 border-t border-hair relative"
      style={{ backgroundColor: 'var(--bg)' }}
      aria-label="Works section"
      onMouseMove={viewMode === 'list' ? handleMouseMove : undefined}
    >
      {/* Works Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <h2
            className="font-display text-[clamp(3.5rem,10vw,10rem)] leading-[0.9] tracking-[-0.04em] flex items-baseline"
            style={{ color: 'var(--text)' }}
          >
            Works
            <sup
              className="text-[0.3em] font-normal ml-2 tabular-numbers align-super"
              style={{ color: 'var(--accent)' }}
              aria-label={`${filteredProjects.length} projects`}
            >
              {filteredProjects.length}
            </sup>
          </h2>
          <p className="text-[13px] mt-2" style={{ color: 'var(--muted)' }}>
            Original character IP, brand systems, 2D motion & explainers
          </p>
        </div>

        {/* Dropdowns Toolbar: Services dropdown + View dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Services Dropdown Menu */}
          <div ref={serviceDropdownRef} className="relative">
            <button
              type="button"
              id="service-filter-dropdown-btn"
              aria-haspopup="listbox"
              aria-expanded={isServiceOpen}
              onClick={() => {
                setIsServiceOpen((prev) => !prev);
                setIsViewOpen(false);
              }}
              className={`min-h-[44px] px-4 py-2 inline-flex items-center space-x-2.5 text-[13px] rounded-[var(--radius)] border transition-all cursor-pointer ${
                selectedService !== 'All'
                  ? 'border-[var(--accent)] text-[var(--text)] bg-[var(--surface)] shadow-sm'
                  : 'border-hair text-[var(--text)] bg-[var(--surface)] hover:bg-[#202020]'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${selectedService !== 'All' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
              <span className="text-[var(--muted)] text-[12px] uppercase tracking-wider micro-label">
                Service:
              </span>
              <span className="font-medium text-[var(--text)]">{selectedService}</span>
              <span className="text-[12px] tabular-numbers text-[var(--muted)]">
                ({serviceCounts[selectedService] ?? filteredProjects.length})
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${
                  isServiceOpen ? 'rotate-180 text-[var(--accent)]' : ''
                }`}
              />
            </button>

            {isServiceOpen && (
              <div
                role="listbox"
                aria-label="Filter by service"
                className="absolute left-0 mt-2 w-64 p-1.5 rounded-[var(--radius)] border border-hair shadow-2xl z-40 animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  boxShadow: 'var(--dropdown-shadow)',
                }}
              >
                <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider micro-label text-[var(--muted)] border-b border-hair mb-1">
                  Filter by Service
                </div>
                {serviceList.map((service) => {
                  const isSelected = selectedService === service;
                  const count = serviceCounts[service] || 0;
                  return (
                    <button
                      key={service}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedService(service);
                        setActiveArchiveIndex(0);
                        setIsServiceOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] rounded-[calc(var(--radius)-2px)] transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[var(--accent-soft)] text-[var(--text)] font-medium'
                          : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{service === 'All' ? 'All Services' : service}</span>
                      </div>
                      <span className="tabular-numbers text-[12px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* View Mode Dropdown Menu */}
          <div ref={viewDropdownRef} className="relative">
            <button
              type="button"
              id="view-mode-dropdown-btn"
              aria-haspopup="listbox"
              aria-expanded={isViewOpen}
              onClick={() => {
                setIsViewOpen((prev) => !prev);
                setIsServiceOpen(false);
              }}
              className="min-h-[44px] px-4 py-2 inline-flex items-center space-x-2.5 text-[13px] rounded-[var(--radius)] border border-hair text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
            >
              {viewMode === 'grid' && <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent)]" />}
              {viewMode === 'list' && <LayoutList className="w-3.5 h-3.5 text-[var(--accent)]" />}
              {viewMode === 'archive' && <GalleryHorizontal className="w-3.5 h-3.5 text-[var(--accent)]" />}
              <span className="text-[var(--muted)] text-[12px] uppercase tracking-wider micro-label">
                View:
              </span>
              <span className="font-medium text-[var(--text)]">
                {viewMode === 'grid' ? 'Grid' : viewMode === 'list' ? 'List' : 'Archive'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${
                  isViewOpen ? 'rotate-180 text-[var(--accent)]' : ''
                }`}
              />
            </button>

            {isViewOpen && (
              <div
                role="listbox"
                aria-label="Select view mode"
                className="absolute right-0 sm:left-0 mt-2 w-64 p-1.5 rounded-[var(--radius)] border border-hair shadow-2xl z-40 animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  boxShadow: 'var(--dropdown-shadow)',
                }}
              >
                <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider micro-label text-[var(--muted)] border-b border-hair mb-1">
                  Presentation View
                </div>
                {[
                  {
                    mode: 'grid' as ViewMode,
                    label: 'Grid View',
                    desc: 'Visual card & video showcase',
                    icon: LayoutGrid,
                  },
                  {
                    mode: 'list' as ViewMode,
                    label: 'List View',
                    desc: 'Editorial index with hover preview',
                    icon: LayoutList,
                  },
                  {
                    mode: 'archive' as ViewMode,
                    label: 'Archive View',
                    desc: 'Cinema slide-by-slide presentation',
                    icon: GalleryHorizontal,
                  },
                ].map(({ mode, label, desc, icon: Icon }) => {
                  const isSelected = viewMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setViewMode(mode);
                        setIsViewOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] rounded-[calc(var(--radius)-2px)] transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[var(--accent-soft)] text-[var(--text)]'
                          : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
                        <div>
                          <div className={`font-medium ${isSelected ? 'text-[var(--text)]' : ''}`}>{label}</div>
                          <div className="text-[11px] text-[var(--muted)] leading-tight">{desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Clear filter if a service is chosen */}
          {selectedService !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedService('All')}
              className="text-xs text-[var(--accent)] hover:underline px-2.5 py-1 min-h-[44px] flex items-center cursor-pointer transition-opacity"
              aria-label="Clear service filter"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center border-t border-b border-hair">
          <p className="text-base mb-6" style={{ color: 'var(--muted)' }}>
            Nothing here yet. Try another service.
          </p>
          <button
            type="button"
            onClick={() => setSelectedService('All')}
            className="link-secondary"
          >
            Reset service filter
          </button>
        </div>
      ) : (
        <>
          {/* ARCHIVE VIEW */}
          {viewMode === 'archive' && activeProject && (
            <div className="w-full flex flex-col space-y-8">
              {/* Minimal top navigation bar with minimal arrow on both ends */}
              <div
                className="w-full flex items-center justify-between py-2 border-b border-hair"
                aria-label="Archive navigation bar"
              >
                <button
                  type="button"
                  onClick={() => changeArchiveProject(activeArchiveIndex - 1)}
                  className="flex items-center space-x-2 text-[13px] tracking-tight hover:text-[var(--accent)] transition-all min-h-[44px] px-3 py-1 rounded-[var(--radius)] hover:bg-[var(--surface-hover)] cursor-pointer group/prev"
                  style={{ color: 'var(--text)' }}
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover/prev:-translate-x-1" strokeWidth={1.5} />
                  <span className="hidden sm:inline micro-label font-medium">Prev</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProject(activeProject)}
                  className="flex items-center space-x-3 text-center group/center cursor-pointer py-1 px-3 rounded-[var(--radius)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <span className="micro-label tabular-numbers text-[12px] font-mono" style={{ color: 'var(--accent)' }}>
                    ({activeProject.number})
                  </span>
                  <span className="text-[14px] font-medium hidden sm:inline text-[var(--text)] group-hover/center:text-[var(--accent)] transition-colors">
                    {activeProject.title}
                  </span>
                  <span className="text-[12px] tabular-numbers font-mono" style={{ color: 'var(--muted)' }}>
                    {activeArchiveIndex + 1} / {filteredProjects.length}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)] opacity-0 group-hover/center:opacity-100 transition-all duration-200 hidden sm:inline -translate-x-1 group-hover/center:translate-x-0" />
                </button>

                <button
                  type="button"
                  onClick={() => changeArchiveProject(activeArchiveIndex + 1)}
                  className="flex items-center space-x-2 text-[13px] tracking-tight hover:text-[var(--accent)] transition-all min-h-[44px] px-3 py-1 rounded-[var(--radius)] hover:bg-[var(--surface-hover)] cursor-pointer group/next"
                  style={{ color: 'var(--text)' }}
                  aria-label="Next project"
                >
                  <span className="hidden sm:inline micro-label font-medium">Next</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/next:translate-x-1" strokeWidth={1.5} />
                </button>
              </div>

              {/* Viewer: Left 5 cols info, Right 7 cols large media */}
              <div
                key={wipeKey}
                className="archive-wipe grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-2"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Left 5 Columns: Project Data & Link */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 micro-label text-[12px]">
                      <span className="tabular-numbers">({activeProject.number})</span>
                      <span style={{ color: 'var(--muted)' }}>{activeProject.client}</span>
                      {activeProject.badge && (
                        <span
                          className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[var(--radius)]"
                          style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--paper-ink)',
                          }}
                        >
                          {activeProject.badge}
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[0.92] tracking-[-0.04em]"
                      style={{ color: 'var(--text)' }}
                    >
                      {activeProject.title}
                    </h3>

                    {activeProject.description && (
                      <p className="text-[16px] leading-[1.6] pt-2" style={{ color: 'var(--muted)' }}>
                        {activeProject.description}
                      </p>
                    )}

                    {activeProject.services && activeProject.services.length > 0 && (
                      <div className="pt-3">
                        <span className="micro-label block mb-1">Services</span>
                        <ul className="space-y-1 text-sm" style={{ color: 'var(--text)' }}>
                          {activeProject.services.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => onSelectProject(activeProject)}
                      className="link-secondary text-base font-medium"
                    >
                      View case study
                    </button>
                  </div>
                </div>

                {/* Right 7 Columns: Media + Controls */}
                <div className="lg:col-span-7 flex flex-col space-y-3">
                  {/* Controls above media: Minimal arrows on both ends with hover micro-nudge */}
                  <div className="flex items-center justify-between micro-label text-[12px] py-1">
                    <button
                      type="button"
                      onClick={() => changeArchiveProject(activeArchiveIndex - 1)}
                      className="min-h-[44px] px-3 py-1.5 rounded-[var(--radius)] flex items-center space-x-1.5 hover:bg-[var(--surface-hover)] border border-transparent hover:border-hair text-[var(--text)] transition-all duration-200 cursor-pointer group/btn"
                      aria-label="Previous project"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-x-1" strokeWidth={1.5} />
                      <span className="font-medium">Prev</span>
                    </button>

                    <div className="flex-1 flex items-center justify-center space-x-3 px-4">
                      <div className="flex-1 h-px border-t border-hair" />
                      <span className="tabular-numbers whitespace-nowrap font-mono text-[11px]" style={{ color: 'var(--muted)' }}>
                        {activeArchiveIndex + 1} of {filteredProjects.length}
                      </span>
                      <div className="flex-1 h-px border-t border-hair" />
                    </div>

                    <button
                      type="button"
                      onClick={() => changeArchiveProject(activeArchiveIndex + 1)}
                      className="min-h-[44px] px-3 py-1.5 rounded-[var(--radius)] flex items-center space-x-1.5 hover:bg-[var(--surface-hover)] border border-transparent hover:border-hair text-[var(--text)] transition-all duration-200 cursor-pointer group/btn"
                      aria-label="Next project"
                    >
                      <span className="font-medium">Next</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Large Media with Hover Video Preview (4:3 Landscape) & Micro-Interactions */}
                  <div
                    className="relative w-full aspect-[4/3] bg-[var(--bg-deep)] overflow-hidden rounded-[var(--radius)] cursor-pointer group shadow-xl border border-hair/60 hover:border-[var(--accent)]/50 hover:shadow-[0_20px_50px_-12px_rgba(255,125,181,0.2)] transition-all duration-300"
                    onClick={() => onSelectProject(activeProject)}
                  >
                    <ArchiveMediaCard project={activeProject} />
                  </div>

                  {/* Caption row below media */}
                  <div className="flex items-center justify-between micro-label text-[12px] pt-1">
                    <span style={{ color: 'var(--muted)' }}>Client: {activeProject.client}</span>
                    <span style={{ color: 'var(--muted)' }}>Service: {activeProject.service}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col cursor-pointer group"
                  onClick={() => onSelectProject(project)}
                >
                  {/* 4:3 Landscape Thumbnail Container */}
                  <div className="relative w-full aspect-[4/3] bg-[var(--bg-deep)] rounded-[var(--radius)] overflow-hidden mb-3.5 border border-hair/60 group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_12px_36px_-6px_rgba(255,125,181,0.18)] transition-all duration-300 ease-out">
                    {project.badge && (
                      <div
                        className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[var(--radius)] shadow"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--btn-primary-text)',
                        }}
                      >
                        {project.badge}
                      </div>
                    )}
                    <GridMediaCard project={project} />
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <h4 className="text-[15px] font-medium tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200 flex items-center space-x-1.5 min-w-0 pr-2">
                      <span className="truncate">{project.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-[var(--accent)] shrink-0" />
                    </h4>
                    <span className="tabular-numbers text-[12px] font-mono text-[var(--muted)] group-hover:text-[var(--text)] transition-colors duration-200 shrink-0">
                      {project.year}
                    </span>
                  </div>
                  <div className="micro-label text-[12px] pt-0.5 text-[var(--muted)] group-hover:text-[var(--muted)]/80 transition-colors">
                    {project.client}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse" role="table">
                <thead>
                  <tr className="border-b border-hair micro-label text-[12px]">
                    <th className="py-4 font-normal w-16">No.</th>
                    <th className="py-4 font-normal">Project</th>
                    <th className="py-4 font-normal">Client</th>
                    <th className="py-4 font-normal hidden sm:table-cell">Service</th>
                    <th className="py-4 font-normal text-right">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      onMouseEnter={() => setFloatingProject(project)}
                      onMouseLeave={() => setFloatingProject(null)}
                      className="border-b border-hair hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer group relative"
                    >
                      <td className="py-6 tabular-numbers text-[12px] font-mono text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-200 relative pl-4">
                        {/* Tactile Edge Accent Notch */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[var(--accent)] group-hover:h-8 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_var(--accent)]" />
                        {project.number}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center space-x-3.5">
                          {/* Mobile 4:3 landscape thumbnail on touch/mobile */}
                          <div className="block md:hidden w-20 aspect-[4/3] flex-shrink-0 rounded-[var(--radius)] overflow-hidden bg-[var(--bg-deep)] border border-hair group-hover:border-[var(--accent)]/50 transition-colors">
                            <img
                              src={project.posterUrl}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span
                              className="font-display text-[clamp(1.5rem,3.4vw,3rem)] leading-none tracking-[-0.04em] text-[var(--text)] group-hover:text-[var(--accent)] group-hover:translate-x-2 transition-all duration-300 ease-out inline-flex items-center"
                            >
                              <span>{project.title}</span>
                              <ArrowUpRight className="w-5 h-5 ml-2 text-[var(--accent)] opacity-0 -translate-x-2 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
                            </span>
                            {project.badge && (
                              <span
                                className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-[var(--radius)]"
                                style={{
                                  backgroundColor: 'var(--accent)',
                                  color: 'var(--btn-primary-text)',
                                }}
                              >
                                {project.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-sm text-[var(--muted)] group-hover:text-[var(--text)] transition-colors duration-200">
                        {project.client}
                      </td>
                      <td className="py-6 text-sm hidden sm:table-cell text-[var(--muted)] group-hover:text-[var(--text)] transition-colors duration-200">
                        <span className="px-2.5 py-1 rounded-[var(--radius)] text-[12px] bg-[var(--surface)] border border-hair group-hover:border-[var(--accent)]/40 group-hover:bg-[var(--accent-soft)] transition-all duration-200 inline-block">
                          {project.service}
                        </span>
                      </td>
                      <td className="py-6 tabular-numbers text-sm text-right font-mono text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-200">
                        {project.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Floating Preview for Desktop List View (4:3 Landscape) */}
              <div
                ref={floatingPreviewRef}
                className={`fixed pointer-events-none z-50 transition-opacity duration-150 rounded-[var(--radius)] overflow-hidden shadow-2xl border border-hair hidden md:block ${
                  floatingProject ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  width: '320px',
                  height: '240px', // 4:3 landscape ratio (320x240)
                  backgroundColor: 'var(--surface)',
                  top: 0,
                  left: 0,
                  willChange: 'transform',
                }}
              >
                {floatingProject && (
                  <FloatingPreviewCard project={floatingProject} />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

// Subcomponent: Archive Large Media Card with lazy/hover video
const ArchiveMediaCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={project.posterUrl}
        alt={project.title}
        className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out will-change-transform"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {project.previewVideoUrl && (
        <video
          ref={videoRef}
          src={project.previewVideoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Subtle vignette on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Live Motion Reel Equalizer Badge */}
      {project.previewVideoUrl && isHovered && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] text-white shadow-md animate-fade-in pointer-events-none">
          <span className="flex space-x-0.5 items-end h-2.5">
            <span className="w-0.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-2.5 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/90">Motion Reel</span>
        </div>
      )}

      {/* Centered Explore Case Study Micro-Affordance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/25 text-white text-xs font-medium tracking-wide flex items-center space-x-2 shadow-2xl opacity-0 scale-90 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300">
          <span>Explore Case Study</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
};

// Subcomponent: Grid Card Media with hover video & centered touch IntersectionObserver
const GridMediaCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Touch devices: IntersectionObserver plays most centered card's preview only
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouch || !containerRef.current || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            videoRef.current?.play().catch(() => {});
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: [0.6] }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={project.posterUrl}
        alt={project.title}
        className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out will-change-transform"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      {project.previewVideoUrl && (
        <video
          ref={videoRef}
          src={project.previewVideoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Subtle vignette on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Live Preview Motion Equalizer Badge */}
      {project.previewVideoUrl && isHovered && (
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-1.5 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/15 text-[10px] text-white shadow-md animate-fade-in pointer-events-none">
          <span className="flex space-x-0.5 items-end h-2.5">
            <span className="w-0.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-2.5 bg-[var(--accent)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/90">Preview</span>
        </div>
      )}

      {/* Explore Pill Button Micro-Affordance */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none shadow-md">
        <span>Explore</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </div>
  );
};

// Subcomponent: Floating Preview inside cursor
const FloatingPreviewCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (project.previewVideoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [project]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={project.posterUrl}
        alt=""
        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
        loading="eager"
        referrerPolicy="no-referrer"
      />
      {project.previewVideoUrl && (
        <video
          ref={videoRef}
          src={project.previewVideoUrl}
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Subtle bottom gradient with meta overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3.5 pointer-events-none">
        <div className="flex items-center justify-between text-white gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-mono font-semibold block truncate">
              {project.service}
            </span>
            <p className="text-[13px] font-medium truncate text-white leading-tight">
              {project.title}
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white shrink-0 font-mono flex items-center space-x-1">
            <span>{project.year}</span>
            <ArrowUpRight className="w-3 h-3 text-[var(--accent)]" />
          </span>
        </div>
      </div>
    </div>
  );
};
