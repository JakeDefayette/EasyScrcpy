import { useState, useEffect, useRef } from "react";

interface EditLabelModalProps {
  currentLabel: string;
  deviceName: string;
  onSave: (label: string) => void;
  onClose: () => void;
}

export function EditLabelModal({ currentLabel, deviceName, onSave, onClose }: EditLabelModalProps) {
  const [label, setLabel] = useState(currentLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(label.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-0.5">
              Edit Device Label
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)] font-mono">
              {deviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 -mt-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter a custom label..."
              className="w-full px-3 py-2.5 text-[13px] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            {label && (
              <button
                type="button"
                onClick={() => setLabel("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-md transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-[12px] font-medium bg-[var(--color-accent)] text-white rounded-md hover:bg-[var(--color-accent-hover)] transition-all"
            >
              Save Label
            </button>
          </div>
        </form>

        {/* Keyboard shortcut hint */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
          <p className="text-[10px] text-[var(--color-text-muted)] text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] font-mono text-[9px]">Enter</kbd> to save · <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] font-mono text-[9px]">Esc</kbd> to cancel
          </p>
        </div>
      </div>
    </div>
  );
}
