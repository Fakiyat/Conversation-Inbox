import { useState } from 'react'
import {
  X,
  Clock,
  Bot,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Star,
} from 'lucide-react'
import { clsx } from 'clsx'
import type { Conversation } from '@/types/conversation'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { ChannelIcon } from '@/components/ui/ChannelIcon'

interface ConversationDetailProps {
  conversation: Conversation
  onClose: () => void
  onAssign: () => Promise<void>
  onResolve: () => Promise<void>
  onTransfer: () => Promise<void>
}

type ActionState = 'idle' | 'loading' | 'done'

export function ConversationDetail({
  conversation: c,
  onClose,
  onAssign,
  onResolve,
  onTransfer,
}: ConversationDetailProps) {
  const [assignState, setAssignState] = useState<ActionState>('idle')
  const [resolveState, setResolveState] = useState<ActionState>('idle')
  const [transferState, setTransferState] = useState<ActionState>('idle')

  const isResolved = c.status === 'resolved'
  const isAssigned = c.assignedAgent !== null
  const anyLoading =
    assignState === 'loading' || resolveState === 'loading' || transferState === 'loading'

  async function handleAssign() {
    if (anyLoading) return
    setAssignState('loading')
    await onAssign()
    setAssignState('idle')
  }

  async function handleResolve() {
    if (anyLoading) return
    setResolveState('loading')
    await onResolve()
    setResolveState('idle')
  }

  async function handleTransfer() {
    if (anyLoading) return
    setTransferState('loading')
    await onTransfer()
    setTransferState('idle')
  }

  const waitLabel =
    c.waitingMinutes === 0
      ? 'Resolved'
      : c.waitingMinutes < 60
        ? `${c.waitingMinutes}m`
        : `${Math.floor(c.waitingMinutes / 60)}h ${c.waitingMinutes % 60}m`

  return (
    <div className="flex flex-col h-full bg-surface-raised animate-slide-in" aria-label="Conversation detail">
      {/* Detail header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
              c.priority === 'urgent'
                ? 'bg-priority-urgent-dim text-priority-urgent'
                : c.priority === 'high'
                  ? 'bg-priority-high-dim text-priority-high'
                  : 'bg-surface-overlay text-text-secondary'
            )}
          >
            {c.customerAvatar}
          </div>
          <div>
            <h3 className="text-text-primary font-semibold text-sm">{c.customerName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <PriorityBadge priority={c.priority} />
              <span className="text-text-muted" aria-label={`Channel: ${c.channel}`}>
                <ChannelIcon channel={c.channel} className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            label="Wait time"
            value={waitLabel}
            highlight={c.waitingMinutes >= 30 && !isResolved}
          />
          <StatCard
            icon={<Star className="w-4 h-4" />}
            label="Satisfaction"
            value={`${c.satisfactionScore}/5`}
            highlight={c.satisfactionScore <= 2}
          />
          <StatCard
            icon={<MessageCircle className="w-4 h-4" />}
            label="Messages"
            value={String(c.messageCount)}
            highlight={false}
          />
        </div>

        {/* Last message */}
        <Section title="Customer message">
          <p className="text-text-secondary text-sm leading-relaxed">
            "{c.lastMessage}"
          </p>
        </Section>

        {/* AI Summary */}
        <Section title="AI summary" icon={<Bot className="w-3.5 h-3.5 text-accent-blue" />}>
          <p className="text-text-secondary text-sm leading-relaxed">{c.aiSummary}</p>
        </Section>

        {/* Failure reason */}
        <Section title="Escalation reason" icon={<AlertCircle className="w-3.5 h-3.5 text-priority-high" />}>
          <p className="text-priority-high text-sm leading-relaxed">{c.failureReason}</p>
        </Section>

        {/* Tags */}
        {c.tags.length > 0 && (
          <Section title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-surface-overlay text-text-muted rounded font-mono border border-surface-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Assigned agent */}
        {c.assignedAgent && (
          <Section title="Assigned to">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent-blue-dim flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5 text-accent-blue" />
              </div>
              <span className="text-text-primary text-sm">{c.assignedAgent}</span>
            </div>
          </Section>
        )}

        {/* Keyboard shortcut hint */}
        <div className="pt-1 border-t border-surface-border">
          <p className="text-text-muted text-xs">
            Press <Kbd>A</Kbd> to assign · <Kbd>R</Kbd> to resolve · <Kbd>Esc</Kbd> to close
          </p>
        </div>
      </div>

      {/* Action footer */}
      {!isResolved && (
        <div className="px-5 py-4 border-t border-surface-border space-y-2 shrink-0">
          {/* Primary: Assign */}
          {!isAssigned && (
            <ActionButton
              onClick={handleAssign}
              loading={assignState === 'loading'}
              disabled={anyLoading}
              variant="primary"
              icon={<UserCheck className="w-4 h-4" />}
              shortcut="A"
            >
              Assign to me
            </ActionButton>
          )}

          {/* Resolve */}
          <ActionButton
            onClick={handleResolve}
            loading={resolveState === 'loading'}
            disabled={anyLoading}
            variant="success"
            icon={<CheckCircle2 className="w-4 h-4" />}
            shortcut="R"
          >
            Mark resolved
          </ActionButton>

          {/* Transfer */}
          {isAssigned && (
            <ActionButton
              onClick={handleTransfer}
              loading={transferState === 'loading'}
              disabled={anyLoading}
              variant="ghost"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to queue
            </ActionButton>
          )}
        </div>
      )}

      {isResolved && (
        <div className="px-5 py-4 border-t border-surface-border">
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Resolved</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <h4 className="text-text-muted text-xs font-medium uppercase tracking-wider">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight: boolean
}) {
  return (
    <div className="bg-surface-overlay rounded-lg px-3 py-2.5 space-y-1">
      <div className={clsx('flex items-center gap-1', highlight ? 'text-priority-urgent' : 'text-text-muted')}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={clsx('text-base font-semibold tabular-nums', highlight ? 'text-priority-urgent' : 'text-text-primary')}>
        {value}
      </p>
    </div>
  )
}

interface ActionButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
  variant: 'primary' | 'success' | 'ghost'
  icon: React.ReactNode
  shortcut?: string
  children: React.ReactNode
}

function ActionButton({ onClick, loading, disabled, variant, icon, shortcut, children }: ActionButtonProps) {
  const base = 'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised'

  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-blue-500 focus-visible:ring-accent-blue disabled:opacity-50',
    success: 'bg-success/10 text-success border border-success/30 hover:bg-success/20 focus-visible:ring-success disabled:opacity-50',
    ghost: 'bg-surface-overlay text-text-secondary border border-surface-border hover:text-text-primary hover:bg-surface-border focus-visible:ring-surface-border disabled:opacity-50',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant])}
      aria-busy={loading}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        icon
      )}
      <span>{loading ? 'Working…' : children}</span>
      {shortcut && !loading && (
        <Kbd className="ml-auto opacity-50">{shortcut}</Kbd>
      )}
    </button>
  )
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={clsx(
        'inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono rounded',
        'bg-surface-base border border-surface-border text-text-muted',
        className
      )}
    >
      {children}
    </kbd>
  )
}
