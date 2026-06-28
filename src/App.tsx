import { useState, useCallback } from "react";
import { StatusBar } from "@/components/StatusBar/StatusBar";
import { ConversationList } from "@/components/ConversationList/ConversationList";
import { ConversationDetail } from "@/components/ConversationDetail/ConversationDetail";
import { ToastList } from "@/components/ui/Toast";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import {
  useConversations,
  sortConversations,
  filterConversations,
} from "@/hooks/useConversations";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useToast } from "@/hooks/useToast";
import type { Conversation, Filters, SortKey } from "@/types/conversation";

export default function App() {
  const {
    conversations,
    loadingState,
    error,
    reload,
    assignConversation,
    resolveConversation,
    transferConversation,
  } = useConversations();

  const { toasts, showToast, dismissToast } = useToast();

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keep a derived sorted list for keyboard nav
  const defaultFilters: Filters = {
    status: "all",
    priority: "all",
    search: "",
  };
  const sortedConvs = sortConversations(
    filterConversations(conversations, defaultFilters),
    "priority" as SortKey,
  );

  const handleSelect = useCallback((conv: Conversation, index: number) => {
    setSelectedConv(conv);
    setSelectedIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedConv(null);
  }, []);

  const handleAssign = useCallback(async () => {
    if (!selectedConv) return;
    const result = await assignConversation(selectedConv.id);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      setSelectedConv((prev) =>
        prev ? { ...prev, assignedAgent: "You", status: "active" } : null,
      );
    }
  }, [selectedConv, assignConversation, showToast]);

  const handleResolve = useCallback(async () => {
    if (!selectedConv) return;
    const result = await resolveConversation(selectedConv.id);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      setSelectedConv((prev) =>
        prev ? { ...prev, status: "resolved", waitingMinutes: 0 } : null,
      );
    }
  }, [selectedConv, resolveConversation, showToast]);

  const handleTransfer = useCallback(async () => {
    if (!selectedConv) return;
    const result = await transferConversation(selectedConv.id);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) {
      setSelectedConv((prev) =>
        prev ? { ...prev, assignedAgent: null, status: "waiting" } : null,
      );
    }
  }, [selectedConv, transferConversation, showToast]);

  // Keyboard nav
  useKeyboardNav({
    listLength: sortedConvs.length,
    selectedIndex,
    enabled: true,
    onSelect: (idx) => {
      const conv = sortedConvs[idx];
      if (conv) handleSelect(conv, idx);
    },
    onAssign: () => {
      void handleAssign();
    },
    onResolve: () => {
      void handleResolve();
    },
    onClose: handleClose,
  });

  return (
    <div className="h-screen bg-surface-base flex flex-col overflow-hidden">
      <StatusBar
        conversations={conversations}
        showShortcuts={showShortcuts}
        onToggleShortcuts={() => setShowShortcuts((v) => !v)}
      />

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — list */}
        <div
          className={`
            flex flex-col border-r border-surface-border transition-all duration-200
            ${selectedConv ? "w-[360px] min-w-[280px]" : "flex-1"}
          `}
        >
          <ConversationList
            conversations={conversations}
            loadingState={loadingState}
            error={error}
            onReload={reload}
            selectedId={selectedConv?.id ?? null}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
        </div>

        {/* Right panel — detail */}
        {selectedConv ? (
          <div className="flex-1 overflow-hidden">
            <ConversationDetail
              key={selectedConv.id}
              conversation={selectedConv}
              onClose={handleClose}
              onAssign={handleAssign}
              onResolve={handleResolve}
              onTransfer={handleTransfer}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-surface-raised">
            <div className="text-center space-y-2">
              <p className="text-text-secondary text-sm">
                Select a conversation to view details
              </p>
              <p className="text-text-muted text-xs">
                Use{" "}
                <kbd className="px-1.5 py-0.5 bg-surface-overlay border border-surface-border rounded text-[10px] font-mono">
                  Arrow Up
                </kbd>
                {" / "}
                <kbd className="px-1.5 py-0.5 bg-surface-overlay border border-surface-border rounded text-[10px] font-mono">
                  Arrow Down
                </kbd>{" "}
                to navigate
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Toasts */}
      <ToastList toasts={toasts} onDismiss={dismissToast} />

      {/* Keyboard shortcuts panel */}
      {showShortcuts && (
        <div className="relative">
          <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
        </div>
      )}
    </div>
  );
}
