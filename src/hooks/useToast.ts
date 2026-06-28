import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
  isLeaving?: boolean;
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isLeaving: true } : toast,
      ),
    );

    // Remove after animation finishes
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 350); // Match toastOut animation duration
  }, []);

  const showToast = useCallback((message: string, type: Toast["type"]) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return { toasts, showToast, dismissToast };
}
