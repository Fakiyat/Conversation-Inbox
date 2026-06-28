# Conversation Inbox — Yellow.ai

A purpose-built triage inbox for CX agents handling AI-escalated conversations. Built as a take-home assignment for Yellow.ai.

**Live demo:** [Deploy to Vercel after setup]

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate the MSW service worker
npx msw init public/ --save

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
# Build for production
npm run build
```

---

## Product Write-up

### The real problem I focused on

The brief says agents "waste their morning hunting for the conversation that actually needs them." The key word is *hunting*. The problem isn't that there are too many conversations — it's that there's no signal about *which one matters right now*.

My core product question was: **how does an agent know what to do first, without needing to read every conversation?**

### What I built (and why)

**Priority-first queue with smart sorting**

I made priority the default sort, not recency. An urgent conversation that's been waiting 47 minutes should be at the top, not buried because a low-priority message arrived 2 minutes ago. The agent should open the app and immediately see the red URGENT badges at the top — zero hunting required.

**AI summary + escalation reason on every card**

Each conversation shows *why* the AI failed. Not just "escalated" — but "Repeated delivery failure + logistics API timeout." An agent can read this in 3 seconds and already know what they're walking into before they even open the detail panel.

**Satisfaction score as a visual signal**

Blue dots (1–5) on each card let agents spot low-satisfaction customers at a glance. This is the thing agents "often find out too late" — I put it on the list view so they find out immediately.

**Wait time with color coding**

Grey for under 15 minutes, orange for 15–30, red for 30+. Agents don't need to calculate urgency — the color tells them.

**Full keyboard navigation**

The brief says "ideally, without their hands leaving the keyboard." I took that literally. J/K to move up and down, A to assign, R to resolve, Esc to close. A fast agent can triage 10 conversations without touching the mouse.

---

### What I deliberately cut

**Real-time updates (WebSockets)** — Out of scope per brief. Would add meaningful complexity for something that isn't testable without a real backend.

**Conversation history / full chat transcript** — Important in a real product, but the AI summary gives enough context for triage. The agent's job is to act, not to re-read the full history.

**Agent notes / internal comments** — Useful but secondary. The agent's first job is to get to the right conversation fast.

**Analytics / reporting dashboard** — The manager wants numbers; the agent wants action. I optimized for the agent. Analytics is a separate product surface.

**Multi-agent assignment** — Would require a real backend and user management (explicitly out of scope).

**Notifications / sound alerts** — Out of scope for a mock; would require persistent state.

---

### Prioritization rationale

The most important thing I built was the **list view** — specifically the information density on each row. If an agent has to open a conversation to know whether it matters, the list has failed. I spent the most time making sure each row contains exactly the right signals: name, last message preview, priority, wait time, satisfaction score, channel, and tags — all visible without clicking.

The **detail panel** is secondary — it's for agents who need to act, not just decide. So I gave it the AI summary, escalation reason, and fast action buttons with keyboard shortcuts.

---

## Architecture

```
src/
├── components/
│   ├── ConversationList/
│   │   ├── ConversationList.tsx   # List with sort/filter controls
│   │   └── ConversationRow.tsx    # Single conversation card
│   ├── ConversationDetail/
│   │   └── ConversationDetail.tsx # Detail panel with actions
│   ├── StatusBar/
│   │   └── StatusBar.tsx          # Top bar with live stats
│   └── ui/
│       ├── PriorityBadge.tsx      # Urgent / High / Normal label
│       ├── ChannelIcon.tsx        # Chat / Email / WhatsApp / Phone
│       ├── Skeleton.tsx           # Loading skeletons
│       ├── Toast.tsx              # Success / error toasts
│       └── KeyboardShortcuts.tsx  # Shortcuts reference panel
├── hooks/
│   ├── useConversations.ts        # Data fetching + all write actions
│   ├── useKeyboardNav.ts          # Global keyboard handler
│   └── useToast.ts                # Toast state manager
├── mocks/
│   ├── data.ts                    # 12 realistic mock conversations
│   ├── handlers.ts                # MSW request handlers
│   └── browser.ts                 # MSW worker setup
├── types/
│   └── conversation.ts            # All TypeScript types
├── App.tsx                        # Root layout + state orchestration
└── main.tsx                       # Entry point + MSW bootstrap
```

### State management

No external state library — React's `useState` and `useCallback` are sufficient. All conversation state lives in the `useConversations` hook. The App component owns selection state and wires everything together. This keeps the data flow unidirectional and easy to trace.

### Mock API design

MSW intercepts real `fetch` calls to `/api/conversations/*`. This means the component code looks exactly like it would against a real API — no mock-specific code in components.

The assign action has a **30% random failure rate** to demonstrate the error state. This is the "write path that can fail on demand" the brief requires. The failure produces an error toast with a clear, actionable message.

---

## Known limitations

- **No persistence** — Writes only persist in-memory during the session. Refreshing resets state.
- **No real-time updates** — Queue doesn't update automatically; agents would need to refresh.
- **Mobile layout** — Functional but not optimized. The split-pane design assumes a desktop viewport.
- **No pagination** — Works fine for the mock dataset; a real implementation would need virtual scrolling for large queues.
- **Assign failure is random** — In production this would be deterministic (network error, conflict, etc.). Random failure is for demo purposes only.

---

## Time spent

| Phase | Time |
|---|---|
| Planning & product decisions | ~45 min |
| Project setup + mock data | ~30 min |
| Core components (List, Detail, StatusBar) | ~2.5 hrs |
| Hooks (data, keyboard, toast) | ~1 hr |
| States (loading, error, empty, action feedback) | ~45 min |
| Polish (animations, accessibility, keyboard nav) | ~45 min |
| README | ~30 min |
| **Total** | **~6.5 hrs** |

---

## Tech stack

- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **MSW v2** for API mocking
- **Lucide React** for icons
- **Vite** for bundling
