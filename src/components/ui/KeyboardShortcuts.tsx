import { X } from "lucide-react";

interface KeyboardShortcutsProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "ArrowDown", description: "Next conversation" },
  { key: "ArrowUp", description: "Previous conversation" },
  // { key: "Enter", description: "Open selected conversation" },
  { key: "A", description: "Assign to me" },
  { key: "R", description: "Mark resolved" },
  { key: "Esc", description: "Close detail panel" },
];

export function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
  return (
    <div
      role="dialog"
      aria-label="Keyboard shortcuts"
      aria-modal="true"
      className="absolute bottom-14 right-4 z-40 w-60 bg-surface-overlay border border-surface-border rounded-xl shadow-2xl animate-fade-in"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <span className="text-text-primary text-xs font-semibold">
          Keyboard shortcuts
        </span>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Close shortcuts"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-4 py-3 space-y-2">
        {SHORTCUTS.map(({ key, description }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-text-secondary text-xs">{description}</span>
            <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono bg-surface-base border border-surface-border rounded text-text-muted whitespace-nowrap">
              {key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
