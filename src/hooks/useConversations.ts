import { useState, useEffect, useCallback } from 'react'
import type { Conversation, Filters, SortKey } from '@/types/conversation'

type LoadingState = 'idle' | 'loading' | 'success' | 'error'

interface UseConversationsReturn {
  conversations: Conversation[]
  loadingState: LoadingState
  error: string | null
  reload: () => void
  assignConversation: (id: string) => Promise<{ success: boolean; message: string }>
  resolveConversation: (id: string) => Promise<{ success: boolean; message: string }>
  transferConversation: (id: string) => Promise<{ success: boolean; message: string }>
}

function priorityWeight(p: Conversation['priority']): number {
  return p === 'urgent' ? 3 : p === 'high' ? 2 : 1
}

export function sortConversations(convs: Conversation[], sortKey: SortKey): Conversation[] {
  return [...convs].sort((a, b) => {
    switch (sortKey) {
      case 'priority':
        return priorityWeight(b.priority) - priorityWeight(a.priority)
      case 'waitTime':
        return b.waitingMinutes - a.waitingMinutes
      case 'satisfaction':
        return a.satisfactionScore - b.satisfactionScore
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })
}

export function filterConversations(convs: Conversation[], filters: Filters): Conversation[] {
  return convs.filter((c) => {
    if (filters.status !== 'all' && c.status !== filters.status) return false
    if (filters.priority !== 'all' && c.priority !== filters.priority) return false
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      const matches =
        c.customerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)) ||
        c.aiSummary.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoadingState('loading')
    setError(null)
    try {
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = (await res.json()) as Conversation[]
      setConversations(data)
      setLoadingState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations')
      setLoadingState('error')
    }
  }, [])

  useEffect(() => {
    void fetchConversations()
  }, [fetchConversations])

  const assignConversation = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      try {
        const res = await fetch(`/api/conversations/${id}/assign`, { method: 'PATCH' })
        if (!res.ok) {
          const body = (await res.json()) as { error?: string }
          return { success: false, message: body.error ?? 'Assignment failed. Try again.' }
        }
        const updated = (await res.json()) as Conversation
        setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)))
        return { success: true, message: 'Conversation assigned to you.' }
      } catch {
        return { success: false, message: 'Network error. Check your connection.' }
      }
    },
    []
  )

  const resolveConversation = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      try {
        const res = await fetch(`/api/conversations/${id}/resolve`, { method: 'PATCH' })
        if (!res.ok) return { success: false, message: 'Failed to resolve. Try again.' }
        const updated = (await res.json()) as Conversation
        setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)))
        return { success: true, message: 'Conversation resolved.' }
      } catch {
        return { success: false, message: 'Network error. Check your connection.' }
      }
    },
    []
  )

  const transferConversation = useCallback(
    async (id: string): Promise<{ success: boolean; message: string }> => {
      try {
        const res = await fetch(`/api/conversations/${id}/transfer`, { method: 'PATCH' })
        if (!res.ok) return { success: false, message: 'Failed to transfer. Try again.' }
        const updated = (await res.json()) as Conversation
        setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)))
        return { success: true, message: 'Conversation transferred back to queue.' }
      } catch {
        return { success: false, message: 'Network error. Check your connection.' }
      }
    },
    []
  )

  return {
    conversations,
    loadingState,
    error,
    reload: fetchConversations,
    assignConversation,
    resolveConversation,
    transferConversation,
  }
}
