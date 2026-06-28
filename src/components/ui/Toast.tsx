import { CheckCircle, XCircle, X } from "lucide-react";
import { clsx } from "clsx";
import type { Toast } from "@/hooks/useToast";

interface ToastListProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastList({ toasts, onDismiss }: ToastListProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-1.5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "group flex items-center gap-2.5",
            "min-w-[350px] max-w-sm",
            "rounded-full border px-3 py-2",
            "backdrop-blur-sm shadow-lg",
            toast.isLeaving ? "animate-toast-out" : "animate-toast-in",
            toast.type === "success"
              ? "bg-success-bg border-success/20 text-success"
              : "bg-error-bg border-error/20 text-error",
          )}
        >
          <div
            className={clsx(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              toast.type === "success" ? "bg-success/10" : "bg-error/10",
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
          </div>

          <span className="flex-1 text-sm font-medium leading-5">
            {toast.message}
          </span>

          <button
            onClick={() => onDismiss(toast.id)}
            className="rounded-md p-1 text-current opacity-50 transition-all  hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
