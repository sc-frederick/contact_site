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
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  info: <Info className="w-4 h-4 text-accent" />,
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
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg",
        "bg-bg-surface border-border/50 backdrop-blur-sm",
        "animate-in slide-in-from-bottom-2 fade-in duration-300"
      )}
    >
      {icons[toast.type]}
      <p className="font-body text-sm text-text-primary flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
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
