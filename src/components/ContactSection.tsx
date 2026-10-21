import React, { useState } from 'react';

interface ContactSectionProps {
  onBackToTop?: () => void;
}

interface FormState {
  name: string;
  email: string;
  projectDetails: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectDetails?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onBackToTop }) => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    projectDetails: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter an email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.projectDetails.trim()) {
      errs.projectDetails = 'Please share a brief note on your timeline or scope';
    } else if (formData.projectDetails.trim().length < 5) {
      errs.projectDetails = 'Project details should be at least 5 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      setStatusMessage("Got it. I'll be in touch.");
    } else {
      setStatusMessage('Please fix the errors in the form.');
    }
  };

  const scrollToTop = () => {
    if (onBackToTop) {
      onBackToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: 'var(--bg-deep)' }}
      aria-label="Contact and studio inquiry"
    >
      {/* Background Image / Still with Contact Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 contact-scrim" />
      </div>

      {/* Top spacing */}
      <div className="h-16 w-full z-10" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-5 md:px-8 py-12 flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          {/* Docked --paper panel: 5 columns on desktop, full-width bottom sheet on mobile */}
          <div className="lg:col-span-5 w-full">
            <div className="panel-paper p-6 md:p-8 rounded-[var(--radius)] shadow-2xl">
              <div className="mb-6">
                <span className="micro-label block mb-1" style={{ color: 'var(--paper-muted)' }}>
                  Initiate collaboration
                </span>
                <h2
                  className="font-display text-3xl md:text-4xl tracking-tight"
                  style={{ color: 'var(--paper-ink)' }}
                >
                  Start a project
                </h2>
              </div>

              {/* Screen reader live notification */}
              <div aria-live="polite" className="sr-only">
                {statusMessage}
              </div>

              {isSubmitted ? (
                <div className="py-10 text-left space-y-3">
                  <p
                    className="font-display text-2xl tracking-tight"
                    style={{ color: 'var(--paper-ink)' }}
                  >
                    Got it. I'll be in touch.
                  </p>
                  <p className="text-[14px]" style={{ color: 'var(--paper-muted)' }}>
                    Inquiries are answered within one business day from Abuja.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', projectDetails: '' });
                      }}
                      className="text-[13px] underline underline-offset-4"
                      style={{ color: 'var(--paper-ink)' }}
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Name field */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="contact-name"
                      className="text-[12px]"
                      style={{ color: 'var(--paper-muted)' }}
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none transition-colors focus:border-[var(--paper-ink)]"
                      style={{ color: 'var(--paper-ink)' }}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <span id="contact-name-error" className="text-[12px] pt-1 text-red-700">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="contact-email"
                      className="text-[12px]"
                      style={{ color: 'var(--paper-muted)' }}
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none transition-colors focus:border-[var(--paper-ink)]"
                      style={{ color: 'var(--paper-ink)' }}
                      placeholder="name@company.com"
                    />
                    {errors.email && (
                      <span id="contact-email-error" className="text-[12px] pt-1 text-red-700">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Project details */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="contact-details"
                      className="text-[12px]"
                      style={{ color: 'var(--paper-muted)' }}
                    >
                      Project details
                    </label>
                    <textarea
                      id="contact-details"
                      rows={3}
                      value={formData.projectDetails}
                      onChange={(e) => {
                        setFormData({ ...formData, projectDetails: e.target.value });
                        if (errors.projectDetails) setErrors({ ...errors, projectDetails: undefined });
                      }}
                      aria-invalid={Boolean(errors.projectDetails)}
                      aria-describedby={errors.projectDetails ? 'contact-details-error' : undefined}
                      className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none transition-colors focus:border-[var(--paper-ink)] resize-none"
                      style={{ color: 'var(--paper-ink)' }}
                      placeholder="Scope, timeline, or key objectives"
                    />
                    {errors.projectDetails && (
                      <span id="contact-details-error" className="text-[12px] pt-1 text-red-700">
                        {errors.projectDetails}
                      </span>
                    )}
                  </div>

                  {/* Submit: underlined text button with 44px target */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="min-h-[44px] inline-flex items-center text-[15px] font-medium underline underline-offset-4 cursor-pointer hover:opacity-75 transition-opacity"
                      style={{ color: 'var(--paper-ink)' }}
                    >
                      Submit inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right column: Email as large underlined link, socials, phone, location */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10 lg:pl-8 pb-4">
            <div className="space-y-6">
              <span className="micro-label text-[12px] block" style={{ color: 'var(--muted)' }}>
                Direct studio address
              </span>
              <div>
                <a
                  href="mailto:akurawachin@gmail.com"
                  className="font-display text-[clamp(1.75rem,4.2vw,3.75rem)] leading-none tracking-[-0.04em] underline underline-offset-8 break-all hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text)' }}
                >
                  akurawachin@gmail.com
                </a>
              </div>
              <p className="font-serif-italic text-xl text-[var(--muted)]">
                “I love to create and you love good work.”
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-hair pt-8">
              {/* Social links */}
              <div className="space-y-2">
                <span className="micro-label block mb-2" style={{ color: 'var(--muted)' }}>
                  Profiles
                </span>
                <div className="flex flex-col space-y-1 text-[14px]">
                  <a
                    href="https://dribbble.com/wachin"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline underline-offset-4 py-1"
                    style={{ color: 'var(--text)' }}
                  >
                    Dribbble (@wachin)
                  </a>
                  <a
                    href="https://instagram.com/Theakura_"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline underline-offset-4 py-1"
                    style={{ color: 'var(--text)' }}
                  >
                    Instagram (@Theakura_)
                  </a>
                  <a
                    href="https://www.linkedin.com/in/akura-wachin"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline underline-offset-4 py-1"
                    style={{ color: 'var(--text)' }}
                  >
                    LinkedIn (/in/akura-wachin)
                  </a>
                  <a
                    href="tel:+2349044544027"
                    className="hover:underline underline-offset-4 py-1 tabular-numbers"
                    style={{ color: 'var(--muted)' }}
                  >
                    +234 904 454 4027
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <span className="micro-label block mb-2" style={{ color: 'var(--muted)' }}>
                  Base
                </span>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text)' }}>
                  Abuja, Nigeria
                </p>
                <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
                  West Africa Time (UTC+1)
                </p>
                <p className="text-[12px] pt-2" style={{ color: 'var(--muted)' }}>
                  Available for global remote commissions & collaborations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Micro footer in corners */}
      <footer className="relative z-10 w-full px-5 md:px-8 py-6 border-t border-hair flex items-center justify-between micro-label text-[12px]">
        <div className="flex items-center space-x-3" style={{ color: 'var(--muted)' }}>
          <img
            src="/assets/aistudio/My_Logo_0ba1d67d.svg"
            alt="Wachin Akura logo"
            className="h-4 md:h-5 w-auto opacity-80"
          />
          <span>© 2026 Wachin Akura. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-5">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('wachin_portfolio_intro_seen');
              window.location.reload();
            }}
            className="min-h-[44px] inline-flex items-center underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: 'var(--muted)' }}
            aria-label="Replay intro animation"
          >
            Replay intro
          </button>
          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[44px] inline-flex items-center underline underline-offset-4 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >
            Back to top
          </button>
        </div>
      </footer>
    </section>
  );
};
