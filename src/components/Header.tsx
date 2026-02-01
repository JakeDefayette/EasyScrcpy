import { useDeviceStore } from "../stores/deviceStore";
import { stopAllMirrors } from "../lib/tauri";

interface HeaderProps {
  onSettingsClick: () => void;
  onRefresh: () => void;
}

export function Header({ onSettingsClick, onRefresh }: HeaderProps) {
  const { activeMirrors, clearActiveMirrors, isLoading } = useDeviceStore();

  const hasActiveMirrors = activeMirrors.size > 0;

  const handleStopAll = async () => {
    try {
      await stopAllMirrors();
      clearActiveMirrors();
    } catch (e) {
      console.error("Failed to stop all mirrors:", e);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm relative">
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-muted)] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white">
            <path
              d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-[13px] font-semibold text-[var(--color-text-primary)] tracking-tight">
            EasyScrcpy
          </h1>
          {hasActiveMirrors && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-[var(--color-success-muted)] text-[var(--color-success)] rounded animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
              {activeMirrors.size} active
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {hasActiveMirrors && (
          <button
            onClick={handleStopAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-error)] bg-[var(--color-error-muted)] hover:bg-[var(--color-error)]/20 rounded-md transition-all animate-fade-in"
            title="Stop all mirrors (Cmd+Shift+S)"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
              <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />
            </svg>
            Stop All
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all disabled:opacity-40"
          title="Refresh devices (Cmd+R)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>

        <button
          onClick={onSettingsClick}
          className="p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
          title="Settings (Cmd+,)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
