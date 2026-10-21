import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../utils/useTheme.ts';

interface ThemeSwitchProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
  variant?: 'compact' | 'segmented';
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  theme,
  onToggle,
  className = '',
  variant = 'compact',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full border border-hair backdrop-blur-sm ${className}`}
        style={{ backgroundColor: 'var(--surface)' }}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => {
            if (theme !== 'light') onToggle();
          }}
          aria-pressed={theme === 'light'}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-[var(--accent)] text-white font-medium shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="text-[12px]">Light</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (theme !== 'dark') onToggle();
          }}
          aria-pressed={theme === 'dark'}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-[var(--accent)] text-white font-medium shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span className="text-[12px]">Dark</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`min-h-[40px] px-3 py-1.5 rounded-[var(--radius)] border border-hair inline-flex items-center space-x-2 text-[12px] transition-all hover:border-[var(--accent)] cursor-pointer group ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text)',
      }}
      aria-label={`Current mode: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[var(--accent)] transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>
      <span className="micro-label hidden sm:inline capitalize font-medium" style={{ color: 'var(--text)' }}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
