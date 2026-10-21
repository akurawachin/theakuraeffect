import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({ isOpen, onClose, triggerRef }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen, triggerRef]);

  // Handle dialog native cancel event (Esc)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !scope.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className="backdrop:bg-[#141414]/85 backdrop:backdrop-blur-sm p-0 m-auto bg-transparent border-0 rounded-[var(--radius)] text-left max-w-lg w-[calc(100%-2rem)] outline-none"
    >
      <div className="panel-paper p-6 md:p-8 rounded-[var(--radius)] shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 min-h-[44px] min-w-[44px] flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ color: 'var(--paper-ink)' }}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pr-10">
          <div className="flex items-center space-x-2 mb-1.5">
            <img
              src="/assets/aistudio/My_Logo_0ba1d67d.svg"
              alt="Wachin Akura logo"
              className="h-4 w-auto"
            />
            <span className="micro-label" style={{ color: 'var(--paper-muted)' }}>
              Direct calendar scheduling
            </span>
          </div>
          <h3
            className="font-display text-3xl tracking-tight"
            style={{ color: 'var(--paper-ink)' }}
          >
            Start a project
          </h3>
        </div>

        {submitted ? (
          <div className="py-8 space-y-3">
            <p className="font-display text-2xl" style={{ color: 'var(--paper-ink)' }}>
              Got it. I'll be in touch.
            </p>
            <p className="text-[14px]" style={{ color: 'var(--paper-muted)' }}>
              We'll review your scope and send an invite with available time slots.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <p className="text-sm text-red-700 font-medium" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col space-y-1">
              <label htmlFor="modal-name" className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                Name
              </label>
              <input
                id="modal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none focus:border-[var(--paper-ink)]"
                style={{ color: 'var(--paper-ink)' }}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="modal-email" className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none focus:border-[var(--paper-ink)]"
                style={{ color: 'var(--paper-ink)' }}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="modal-scope" className="text-[12px]" style={{ color: 'var(--paper-muted)' }}>
                Project scope
              </label>
              <textarea
                id="modal-scope"
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Brief description of requirements and timeline"
                className="w-full bg-transparent border-0 border-b border-paper-hair py-2 text-[16px] outline-none focus:border-[var(--paper-ink)] resize-none"
                style={{ color: 'var(--paper-ink)' }}
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="btn-primary"
              >
                Schedule call
              </button>
              <button
                type="button"
                onClick={onClose}
                className="link-secondary text-[14px]"
                style={{ color: 'var(--paper-ink)' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
};
