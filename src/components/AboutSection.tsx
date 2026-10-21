import React from 'react';
import portraitImg from '../assets/images/akura_original_portrait_1790030111205.jpg';

interface AboutSectionProps {
  onStartProject?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onStartProject }) => {
  return (
    <section
      id="about"
      className="w-full px-5 md:px-8 py-20 md:py-32 border-t border-hair"
      style={{ backgroundColor: 'var(--bg)' }}
      aria-label="About Wachin Akura"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Portrait Photo & Status Tag */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-[var(--radius)] border border-hair bg-[var(--bg-deep)] group">
            <img
              src={portraitImg}
              alt="Wachin Akura"
              className="photo-placeholder w-full h-full object-cover object-[center_20%] contrast-[1.03] transition-all duration-700"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
            
            {/* Minimal Corner Meta on Portrait */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] micro-label tracking-widest text-white/90">
              <div className="flex items-center space-x-2">
                <img src="/assets/aistudio/My_Logo_0ba1d67d.svg" alt="" className="h-3.5 w-auto" />
                <span>Wachin Akura</span>
              </div>
              <span className="tabular-numbers">Abuja, NG</span>
            </div>
          </div>

          <div className="flex items-center justify-between micro-label text-[11px] px-1" style={{ color: 'var(--muted)' }}>
            <span>Motion Designer & Art Director</span>
            <span className="tabular-numbers">9+ Yrs Exp</span>
          </div>
        </div>

        {/* Right Column: Minimized Essential Bio & Capabilities */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-10 lg:pl-4">
          <div className="space-y-6">
            <span className="micro-label block" style={{ color: 'var(--muted)' }}>
              Profile
            </span>

            <h2
              className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.04em]"
              style={{ color: 'var(--text)' }}
            >
              Certified keyframe <span className="font-serif-italic font-normal">whisperer.</span>
            </h2>

            {/* Minimized Write-up: Crisp, clear, essential */}
            <div className="space-y-4 text-[16px] leading-[1.65] max-w-xl" style={{ color: 'var(--muted)' }}>
              <p>
                Motion designer and animator based in Abuja, 9+ years deep in this. I've animated for <strong style={{ color: 'var(--text)' }}>Snapchat</strong>, <strong style={{ color: 'var(--text)' }}>Coca-Cola</strong>, and <strong style={{ color: 'var(--text)' }}>MTV Base Nigeria</strong>, and I've built a broadcast motion system from scratch. With experience in different sectors.
              </p>
              <p>
                I also build my own tools when the software won't cooperate: custom After Effects panels, a sound design extension for After Effects and Premiere, and whatever it takes to stop doing the same tedious thing twice. And when nobody's briefing me, I'm building <strong style={{ color: 'var(--accent)' }}>Pink Bandana</strong>, my own character IP and worldbuilding universe, mostly to remind myself why I fell in love with this in the first place.
              </p>
              <p>
                Volunteered with <strong style={{ color: 'var(--text)' }}>TEDx Abuja</strong> too, because good ideas deserve motion that actually listens to them.
              </p>
            </div>
          </div>

          {/* Essential Capabilities & Selected Clients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-b border-hair py-8">
            <div className="space-y-2">
              <span className="micro-label block mb-1" style={{ color: 'var(--muted)' }}>
                Focus
              </span>
              <ul className="text-[14px] space-y-1.5" style={{ color: 'var(--text)' }}>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--accent)' }} />
                  <strong style={{ color: 'var(--accent)' }}>Character Animation & IP</strong>
                </li>
                <li>Brand Systems & Broadcast Idents</li>
                <li>Product Explainers & Brand Films</li>
                <li>UI Motion & Micro-animations</li>
                <li>Stage & Keynote Visuals</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="micro-label block mb-1" style={{ color: 'var(--muted)' }}>
                Selected Partners & IP
              </span>
              <ul className="text-[14px] space-y-1.5" style={{ color: 'var(--text)' }}>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: 'var(--accent)' }} />
                  <strong style={{ color: 'var(--text)' }}>Pink Bandana <span className="text-[12px] font-normal" style={{ color: 'var(--accent)' }}>(Original IP)</span></strong>
                </li>
                <li>Coca-Cola / MTV Base</li>
                <li>Snapchat & Snap AR (AWE Keynote & Stage)</li>
                <li>TEDx Abuja / Visit Nigeria</li>
                <li>Flitaa / Afro Soccer</li>
              </ul>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center space-x-6 pt-2">
            <button
              type="button"
              onClick={onStartProject}
              className="btn-primary"
            >
              Start a project
            </button>
            <a
              href="mailto:akurawachin@gmail.com"
              className="link-secondary text-sm font-medium"
            >
              akurawachin@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
