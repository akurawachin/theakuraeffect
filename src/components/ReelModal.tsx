import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  posterUrl: string;
}

export const ReelModal: React.FC<ReelModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  posterUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reel Cinema Player"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
      style={{ backgroundColor: 'rgba(20, 20, 20, 0.96)' }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm z-10 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--text)' }}
        aria-label="Close reel cinema"
      >
        <X className="w-7 h-7" />
      </button>

      <div className="w-full max-w-6xl aspect-[16/9] bg-[#141414] rounded-[var(--radius)] overflow-hidden shadow-2xl relative border border-hair">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML video.
        </video>
      </div>
    </div>
  );
};
