import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, X, Inbox } from 'lucide-react'
import { clsx } from 'clsx'
import type { Conversation, Filters, SortKey } from '@/types/conversation'
import { sortConversations, filterConversations } from '@/hooks/useConversations'
import { ConversationRow } from './ConversationRow'
import { ConversationRowSkeleton } from '@/components/ui/Skeleton'

interface ConversationListProps {
  conversations: Conversation[]
  loadingState: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  onReload: () => void
  selectedId: string | null
  selectedIndex: number
  onSelect: (conv: Conversation, index: number) => void
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'priority', label: 'Priority' },
  { value: 'waitTime', label: 'Wait time' },
  { value: 'satisfaction', label: 'Satisfaction' },
  { value: 'recent', label: 'Recent' },
]

export function ConversationList({
  conversations,
  loadingState,
  error,
  onReload,
  selectedId,
  selectedIndex,
  onSelect,
}: ConversationListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('priority')
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    priority: 'all',
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  // Scroll selected item into view on keyboard nav
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  const processed = useMemo(() => {
    const filtered = filterConversations(conversations, filters)
    return sortConversations(filtered, sortKey)
  }, [conversations, filters, sortKey])

  const waitingCount = conversations.filter((c) => c.status === 'waiting').length

  function clearSearch() {
    setFilters((f) => ({ ...f, search: '' }))
    searchRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-surface-base">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 space-y-3 border-b border-surface-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-text-primary font-semibold text-sm">Queue</h2>
            <p className="text-text-muted text-xs mt-0.5">
              {loadingState === 'success' ? `${waitingCount} waiting` : '—'}
            </p>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={clsx(
              'p-1.5 rounded transition-colors text-text-secondary hover:text-text-primary',
              showFilters ? 'bg-accent-blue-dim text-accent-blue' : 'hover:bg-surface-overlay'
            )}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search by name, tag, or message…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full bg-surface-overlay border border-surface-border rounded-md pl-8 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortKey(opt.value)}
              className={clsx(
                'shrink-0 text-xs px-2.5 py-1 rounded-full transition-colors font-medium',
                sortKey === opt.value
                  ? 'bg-accent-blue text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="space-y-2 pt-1 animate-fade-in">
            <FilterRow
              label="Status"
              options={['all', 'waiting', 'active', 'resolved']}
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v as Filters['status'] }))}
            />
            <FilterRow
              label="Priority"
              options={['all', 'urgent', 'high', 'normal']}
              value={filters.priority}
              onChange={(v) => setFilters((f) => ({ ...f, priority: v as Filters['priority'] }))}
            />
          </div>
        )}
      </div>

      {/* List body */}
      <div className="flex-1 overflow-y-auto" role="listbox" aria-label="Conversations">
        {loadingState === 'loading' && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <ConversationRowSkeleton key={i} />
            ))}
          </>
        )}

        {loadingState === 'error' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-3">
            <p className="text-text-secondary text-sm">{error}</p>
            <button
              onClick={onReload}
              className="text-xs text-accent-blue hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {loadingState === 'success' && processed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-2">
            <Inbox className="w-8 h-8 text-text-muted" />
            <p className="text-text-primary text-sm font-medium">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                ? 'No matches found'
                : "You're all caught up"}
            </p>
            <p className="text-text-muted text-xs">
              {filters.search
                ? 'Try a different search term'
                : 'No conversations in this queue right now'}
            </p>
          </div>
        )}

        {loadingState === 'success' &&
          processed.map((conv, i) => {
            const isSelected = conv.id === selectedId
            return (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                isSelected={isSelected}
                index={i}
                onClick={() => onSelect(conv, i)}
                // @ts-expect-error — attaching ref conditionally via callback
                ref={isSelected ? selectedRef : undefined}
              />
            )
          })}
      </div>
    </div>
  )
}

interface FilterRowProps {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

function FilterRow({ label, options, value, onChange }: FilterRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted text-xs w-12 shrink-0">{label}</span>
      <div className="flex gap-1 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={clsx(
              'text-xs px-2 py-0.5 rounded transition-colors capitalize',
              value === opt
                ? 'bg-surface-overlay text-text-primary border border-surface-border'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
