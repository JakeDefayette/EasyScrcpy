interface EmptyStateProps {
  isLoading: boolean;
  error: string | null;
}

export function EmptyState({ isLoading, error }: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="relative w-10 h-10 mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-accent)] animate-spin" />
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)]">Scanning for devices</p>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Looking for connected Android devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--color-error-muted)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[var(--color-error)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-[13px] font-medium text-[var(--color-error)] mb-1">Failed to detect devices</p>
        <p className="text-[11px] text-[var(--color-text-muted)] max-w-xs text-center leading-relaxed">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Device illustration */}
      <div className="relative mb-6">
        <div className="w-16 h-24 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex items-center justify-center relative overflow-hidden">
          {/* Screen */}
          <div className="absolute inset-2 rounded-lg bg-[var(--color-bg-tertiary)]" />
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[var(--color-border)]" />
          {/* Animated scan line */}
          <div
            className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50"
            style={{
              animation: "scan 2s ease-in-out infinite",
            }}
          />
        </div>
        {/* Connection indicator */}
        <div className="absolute -right-2 -bottom-2 w-6 h-6 rounded-full border-2 border-[var(--color-bg-primary)] bg-[var(--color-bg-tertiary)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-[var(--color-text-muted)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
          </svg>
        </div>
      </div>

      <p className="text-[13px] font-medium text-[var(--color-text-primary)] mb-1">No devices found</p>
      <p className="text-[11px] text-[var(--color-text-muted)] mb-6">Connect an Android device to get started</p>

      {/* Steps */}
      <div className="w-full max-w-xs space-y-2">
        {[
          { step: 1, text: "Connect device via USB cable" },
          { step: 2, text: "Enable USB debugging in Settings" },
          { step: 3, text: "Accept the debugging prompt on device" },
        ].map(({ step, text }) => (
          <div
            key={step}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-md bg-[var(--color-bg-tertiary)] text-[10px] font-medium text-[var(--color-text-muted)] flex items-center justify-center">
              {step}
            </span>
            <span className="text-[11px] text-[var(--color-text-secondary)]">{text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 8px; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: calc(100% - 12px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
