import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { cn } from "~/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="mp-icon text-[var(--color-success)]" />,
  error: <AlertCircle className="mp-icon text-[var(--color-danger)]" />,
  info: <Info className="mp-icon text-accent" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "mp-card mp-card--compact flex-row items-center gap-3 shadow-[var(--shadow-soft)]"
      )}
    >
      {icons[toast.type]}
      <p className="mp-body flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="mp-btn mp-btn--ghost mp-btn--icon"
        aria-label="Dismiss"
      >
        <X className="mp-icon mp-icon--sm" />
      </button>
    </div>
  );
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
