interface EmptyStateProps {
  isLoading: boolean;
  error: string | null;
}

export function EmptyState({ isLoading, error }: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-secondary)]">
        <div className="w-6 h-6 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
        <p className="text-sm">Scanning for devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 mb-4 text-[var(--color-error)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm text-[var(--color-error)] mb-2">Failed to detect devices</p>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-12 h-12 mb-4 text-[var(--color-text-muted)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">No devices found</p>
      <div className="text-xs text-[var(--color-text-muted)] space-y-2 max-w-xs">
        <p className="font-medium text-[var(--color-text-secondary)]">Troubleshooting:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Connect device via USB cable</li>
          <li>Enable USB debugging on device</li>
          <li>Accept USB debugging prompt on device</li>
          <li>Try a different USB cable or port</li>
        </ul>
      </div>
    </div>
  );
}
