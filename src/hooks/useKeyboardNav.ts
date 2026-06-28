import { useEffect } from "react";

interface UseKeyboardNavProps {
  listLength: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAssign: () => void;
  onResolve: () => void;
  onClose: () => void;
  enabled: boolean;
}

export function useKeyboardNav({
  listLength,
  selectedIndex,
  onSelect,
  onAssign,
  onResolve,
  onClose,
  enabled,
}: UseKeyboardNavProps): void {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          onSelect(Math.min(selectedIndex + 1, listLength - 1));
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          onSelect(Math.max(selectedIndex - 1, 0));
          break;
        case "a":
          e.preventDefault();
          onAssign();
          break;
        case "r":
          e.preventDefault();
          onResolve();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    listLength,
    selectedIndex,
    onSelect,
    onAssign,
    onResolve,
    onClose,
  ]);
}
