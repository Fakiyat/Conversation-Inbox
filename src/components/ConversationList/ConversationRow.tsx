import { clsx } from "clsx";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import type { Conversation } from "@/types/conversation";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { ChannelIcon } from "@/components/ui/ChannelIcon";

interface ConversationRowProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

// Premium SaaS styling mapping using standard Tailwind colors
const THEME = {
  urgent: {
    base: "hover:bg-priority-urgent-50/50 border-x-priority-urgent-border",
    selected:
      "bg-priority-urgent-bg border-x-priority-urgent-border shadow-sm ring-1 ring-priority-urgent-glow",
    avatar:
      "bg-priority-urgent-bg text-priority-urgent border border-priority-urgent-border",
    textPrimary: "text-slate-900",
    indicator: "bg-priority-urgent",
  },
  high: {
    base: "hover:bg-amber-50/50 border-x-priority-high-border",
    selected:
      "bg-amber-50 border-x-priority-high-border shadow-sm ring-1 ring-priority-high-glow",
    avatar: "bg-amber-100 text-amber-700 ring-1 ring-amber-200/50",
    textPrimary: "text-slate-900",
    indicator: "bg-amber-500",
  },
  normal: {
    base: "hover:bg-slate-50 border-x-transparent hover:border-x-slate-300",
    selected: "bg-white border-x-slate-800 shadow-sm ring-1 ring-slate-200",
    avatar: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/50",
    textPrimary: "text-slate-900",
    indicator: "bg-slate-400",
  },
  resolved: {
    base: "hover:bg-slate-50 border-x-emerald-400 opacity-80 transition-opacity hover:opacity-100",
    selected:
      "bg-slate-50 border-x-emerald-500 shadow-sm ring-1 ring-slate-200",
    avatar: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/50",
    textPrimary: "text-slate-600 font-medium",
    indicator: "bg-emerald-500",
  },
};

function WaitTime({
  minutes,
  resolved,
}: {
  minutes: number;
  resolved: boolean;
}) {
  if (resolved) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
        <CheckCircle2 className="w-3 h-3" />
        Resolved
      </span>
    );
  }

  const isCritical = minutes >= 30;
  const isWarning = minutes >= 15 && minutes < 30;

  const color = isCritical
    ? "text-red-500 font-medium"
    : isWarning
      ? "text-amber-600 font-light"
      : "text-slate-400 font-light";

  const label =
    minutes < 60
      ? `${minutes}min`
      : `${Math.floor(minutes / 60)}hr ${minutes % 60}min`;

  return (
    <span
      className={clsx(
        "flex items-center gap-1 text-[11px] tabular-nums shrink-0",
        color,
      )}
    >
      <Clock className="w-3 h-3" />
      {label}
    </span>
  );
}

function SatisfactionDots({ score }: { score: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Satisfaction: ${score}/5`}
      title={`Satisfaction score: ${score}/5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "w-1.5 h-1.5 rounded-full transition-colors duration-200",
            i < score
              ? score <= 2
                ? "bg-red-500"
                : score === 3
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              : "bg-slate-200",
          )}
        />
      ))}
    </div>
  );
}

export function ConversationRow({
  conversation: c,
  isSelected,
  onClick,
  index,
}: ConversationRowProps) {
  const isResolved = c.status === "resolved";
  const themeKey = isResolved ? "resolved" : c.priority;
  const theme = THEME[themeKey as keyof typeof THEME];

  return (
    <button
      onClick={onClick}
      data-index={index}
      className={clsx(
        "w-full text-left mx-2 my-1.5 rounded-2xl border-x-[3.3px] border-y-0",
        "transition-all duration-200 group ",
        isSelected ? theme.selected : theme.base,
      )}
      style={{ width: "calc(100% - 1rem)" }}
      aria-selected={isSelected}
      aria-label={`${c.customerName} — ${c.priority} priority${isResolved ? ", resolved" : ""}`}
    >
      <div className="p-3.5 flex items-start gap-3.5">
        {/* Avatar Area */}
        <div className="relative shrink-0 pt-0.5">
          <div
            className={clsx(
              "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shadow-sm",
              theme.avatar,
            )}
          >
            {c.customerAvatar}
          </div>
          {isResolved && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Header: Name & Wait Time */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={clsx(
                "text-[14px] font-semibold truncate tracking-tight",
                theme.textPrimary,
              )}
            >
              {c.customerName}
            </span>
            <WaitTime minutes={c.waitingMinutes} resolved={isResolved} />
          </div>

          {/* Message Preview */}
          <p
            className={clsx(
              "text-[13px] line-clamp-2 leading-relaxed",
              isResolved ? "text-slate-400" : "text-slate-500",
            )}
          >
            {c.lastMessage}
          </p>

          {/* Metadata Row: Badges, Channel, Tags */}
          <div className="flex items-center justify-between gap-2 pt-1.5 mt-0.5 border-t border-slate-100/50">
            <div className="flex items-center gap-2 flex-wrap">
              {!isResolved && (
                <PriorityBadge
                  priority={c.priority}
                  reason={c.priorityReason}
                  impact={c.businessImpact}
                />
              )}

              <div className="flex items-center gap-2 text-slate-400">
                <span
                  title={`Via ${c.channel}`}
                  className="hover:text-slate-600 transition-colors"
                >
                  <ChannelIcon channel={c.channel} />
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium">
                  <MessageCircle className="w-3 h-3" />
                  {c.messageCount}
                </span>
              </div>

              {/* Minimalist Tags */}
              {c.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-1">
                  {c.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-100/80 text-slate-500 rounded-md border border-slate-200/60 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {c.tags.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-medium pl-0.5">
                      +{c.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            <SatisfactionDots score={c.satisfactionScore} />
          </div>
        </div>
      </div>
    </button>
  );
}
