import type { ReactNode } from "react";
import { useToastStore, Toast as ToastType } from "../stores/toastStore";

const icons: Record<ToastType["type"], ReactNode> = {
  error: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  success: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const styles: Record<ToastType["type"], string> = {
  error: "bg-[var(--color-error-muted)] border-[var(--color-error)] text-[var(--color-error)]",
  success: "bg-[var(--color-success-muted)] border-[var(--color-success)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-muted)] border-[var(--color-warning)] text-[var(--color-warning)]",
  info: "bg-[var(--color-accent-glow)] border-[var(--color-accent)] text-[var(--color-accent)]",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToastStore();

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded border
        backdrop-blur-sm shadow-lg animate-slide-up
        ${styles[toast.type]}
      `}
    >
      <span className="shrink-0">{icons[toast.type]}</span>
      <p className="text-sm text-[var(--color-text-primary)] flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
