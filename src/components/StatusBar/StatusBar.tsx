import {
  AlertTriangle,
  Bot,
  Clock,
  Inbox,
  Keyboard,
  UserCheck,
} from "lucide-react";
import { clsx } from "clsx";
import type { Conversation, QueueStats } from "@/types/conversation";

interface StatusBarProps {
  conversations: Conversation[];
  showShortcuts: boolean;
  onToggleShortcuts: () => void;
}

export function StatusBar({
  conversations,
  showShortcuts,
  onToggleShortcuts,
}: StatusBarProps) {
  const stats = conversations.reduce<QueueStats>(
    (acc, conversation) => {
      if (conversation.status !== "resolved") {
        acc[conversation.priority]++;
      }

      acc[conversation.status]++;

      if (conversation.status === "waiting") {
        acc.oldestWait = Math.max(acc.oldestWait, conversation.waitingMinutes);
      }

      if (
        conversation.assignedAgent === "You" &&
        conversation.status !== "resolved"
      ) {
        acc.assigned++;
      }

      acc.escalated++;

      return acc;
    },
    {
      urgent: 0,
      high: 0,
      normal: 0,

      waiting: 0,
      active: 0,
      resolved: 0,

      assigned: 0,
      escalated: 0,

      oldestWait: 0,
    },
  );

  return (
    <header className="bg-white border-b border-surface-border shadow-card shrink-0">
      {/* Top row — brand + shortcuts */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-surface-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center shadow-sm">
            <Inbox className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-text-primary font-bold text-sm tracking-tight">
              Conversation Inbox
            </span>
            <span className="ml-2 text-text-muted text-xs">By Fakiyat</span>
          </div>
        </div>

        <button
          onClick={onToggleShortcuts}
          className={clsx(
            "flex items-center gap-1.5 text-xs py-1 px-2.5 rounded-lg transition-colors border",
            showShortcuts
              ? "bg-accent-blue-light text-accent-blue border-accent-blue-mid"
              : "text-text-muted hover:text-text-secondary border-transparent hover:bg-surface-overlay",
          )}
          aria-label="Toggle keyboard shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-medium">Shortcuts</span>
        </button>
      </div>

      {/* Dashboard stats row */}
      <div className="flex items-stretch divide-x divide-surface-border overflow-x-auto scrollbar-hide">
        {/* Priority breakdown */}
        <StatGroup label="By Priority">
          <PillStat
            color="red"
            label="Urgent"
            value={stats.urgent}
            pulse={stats.urgent > 0}
          />
          <PillStat
            color="yellow"
            label="High"
            value={stats.high}
            pulse={false}
          />
          <PillStat
            color="blue"
            label="Normal"
            value={stats.normal}
            pulse={false}
          />
        </StatGroup>

        {/* Status breakdown */}
        <StatGroup label="By Status">
          <PillStat
            color="yellow"
            label="Waiting"
            value={stats.waiting}
            pulse={stats.waiting > 0}
          />
          <PillStat
            color="blue"
            label="Active"
            value={stats.active}
            pulse={false}
          />
          <PillStat
            color="green"
            label="Resolved"
            value={stats.resolved}
            pulse={false}
          />
        </StatGroup>

        {/* Summary metrics */}
        <StatGroup label="Queue health">
          <MetricStat
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Oldest wait"
            value={`${stats.oldestWait}m`}
            warn={stats.oldestWait > 30}
          />
          {stats.urgent > 0 && (
            <MetricStat
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
              label="Needs action"
              value={stats.urgent}
              warn={true}
            />
          )}
          {/* <MetricStat
            icon={<Users className="w-3.5 h-3.5" />}
            label="Total"
            value={conversations.length}
            warn={false}
          /> */}
          {/* <MetricStat
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            label="Resolved"
            value={stats.resolved}
            warn={false}
            good={stats.resolved > 0}
          /> */}
          <MetricStat
            icon={<UserCheck className="w-3.5 h-3.5" />}
            label="Assigned"
            value={stats.assigned}
          />
          <MetricStat
            icon={<Bot className="w-3.5 h-3.5" />}
            label="Escalated"
            value={stats.escalated}
          />
        </StatGroup>
      </div>
    </header>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StatGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-2.5 min-w-fit">
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

type PillColor = "red" | "yellow" | "blue" | "green";

const PILL_STYLES: Record<PillColor, string> = {
  red: "bg-priority-urgent-bg text-priority-urgent border-priority-urgent-border",
  yellow:
    "bg-priority-high-bg   text-priority-high   border-priority-high-border",
  blue: "bg-priority-normal-bg text-priority-normal  border-priority-normal-border",
  green: "bg-resolved-bg        text-resolved         border-resolved-border",
};

function PillStat({
  color,
  label,
  value,
  pulse,
}: {
  color: PillColor;
  label: string;
  value: number;
  pulse: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap",
        PILL_STYLES[color],
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={clsx(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
              color === "red"
                ? "bg-priority-urgent"
                : color === "yellow"
                  ? "bg-priority-high"
                  : "bg-accent-blue",
            )}
          />
          <span
            className={clsx(
              "relative inline-flex rounded-full h-2 w-2",
              color === "red"
                ? "bg-priority-urgent"
                : color === "yellow"
                  ? "bg-priority-high"
                  : "bg-accent-blue",
            )}
          />
        </span>
      )}
      <span className="tabular-nums font-bold">{value}</span>
      <span className="font-medium opacity-80">{label}</span>
    </div>
  );
}

function MetricStat({
  icon,
  label,
  value,
  warn,
  good,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  warn?: boolean;
  good?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1.5 text-xs whitespace-nowrap",
        warn
          ? "text-priority-urgent"
          : good
            ? "text-resolved"
            : "text-text-secondary",
      )}
    >
      {icon}
      <span className="font-bold tabular-nums">{value}</span>
      <span className="text-text-muted font-medium">{label}</span>
    </div>
  );
}
