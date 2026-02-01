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
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">EasyScrcpy</h1>
        {hasActiveMirrors && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded">
            {activeMirrors.size} active
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {hasActiveMirrors && (
          <button
            onClick={handleStopAll}
            className="px-2 py-1.5 text-xs text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded transition-colors"
            title="Stop all mirrors (Cmd+Shift+S)"
          >
            Stop All
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50"
          title="Refresh devices (Cmd+R)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`w-4 h-4 text-[var(--color-text-muted)] ${isLoading ? "animate-spin" : ""}`}
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
          className="p-1.5 rounded hover:bg-[var(--color-bg-tertiary)] transition-colors"
          title="Settings (Cmd+,)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4 text-[var(--color-text-muted)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
