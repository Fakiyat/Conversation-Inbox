import { clsx } from "clsx";
import type { Priority } from "@/types/conversation";

interface PriorityBadgeProps {
  priority: Priority;
  reason?: string;
  impact?: string;
  size?: "sm" | "md";
}

const LABELS: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
};

const STYLES: Record<Priority, string> = {
  urgent:
    "bg-priority-urgent-dim/60 text-priority-urgent border border-priority-urgent/30",
  high: "bg-priority-high-dim/60 text-priority-high border border-priority-high/30 ",
  normal:
    "bg-priority-normal-dim/60 text-priority-normal border border-priority-normal/30",
};

export function PriorityBadge({
  priority,
  reason,
  impact,
  // size = "sm",
}: PriorityBadgeProps) {
  return (
    <div className="group relative inline-flex">
      {/* Badge Trigger */}
      <span
        className={clsx(
          "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold cursor-help transition-colors",
          STYLES[priority],
        )}
      >
        {LABELS[priority]}
      </span>

      {/* Tooltip Positioning Wrapper */}
      <div
        className="
          pointer-events-none 
          absolute 
          left-full 
          top-1/2 
          z-50 
          ml-2.5 
          -translate-y-1/2
          
          w-56 
          
          /* Initial State for Animation */
          opacity-0 
          translate-x-1 
          scale-[0.97]
          
          /* Transition */
          transition-all 
          duration-200 
          ease-out
          
          /* Hover State */
          group-hover:translate-x-0 
          group-hover:scale-100 
          group-hover:opacity-100
        "
      >
        {/* Tooltip Card */}
        <div className="relative rounded-lg border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50">
          {/* Caret/Arrow pointing left */}
          <div className="absolute -left-1.5 top-1/2 -mt-1.5 h-3 w-3 rotate-45 border-b border-l border-slate-200 bg-white" />

          {/* Tooltip Content (Relative to sit above the caret) */}
          <div className="relative">
            <div className="flex items-center gap-2">
              {/* Status Dot */}
              <div
                className={clsx(
                  "h-1.5 w-1.5 rounded-full shrink-0 shadow-sm",
                  priority === "urgent"
                    ? "bg-red-500"
                    : priority === "high"
                      ? "bg-amber-400"
                      : "bg-slate-400", // Updated to slate to match your new "normal" theme
                )}
              />
              <span className="text-[12px] font-semibold text-slate-800 leading-none">
                {reason}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              {impact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
