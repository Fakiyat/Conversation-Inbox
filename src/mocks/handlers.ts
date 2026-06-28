import { http, HttpResponse, delay } from "msw";
import type { Conversation } from "@/types/conversation";
import { mockConversations } from "./data";

// In-memory store — writes persist for the whole browser session
let conversations: Conversation[] = [...mockConversations];

// Brief says 200–500 ms realistic delay
const DELAY_MS = () => 200 + Math.floor(Math.random() * 300);

export const handlers = [
  // GET all conversations
  http.get("/api/conversations", async () => {
    await delay(DELAY_MS());
    return HttpResponse.json(conversations);
  }),

  // GET single conversation
  http.get("/api/conversations/:id", async ({ params }) => {
    await delay(DELAY_MS());
    const conv = conversations.find((c) => c.id === params.id);
    if (!conv) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(conv);
  }),

  // PATCH assign — fails ~30 % of the time (required by brief)
  http.patch("/api/conversations/:id/assign", async ({ params }) => {
    await delay(DELAY_MS() + 100);
    const shouldFail = Math.random() < 0.3;
    if (shouldFail) {
      return HttpResponse.json(
        { error: "Assignment failed — agent slot unavailable. Try again." },
        { status: 503 },
      );
    }
    conversations = conversations.map((c) =>
      c.id === params.id
        ? {
            ...c,
            assignedAgent: "You",
            status: "active" as const,
            updatedAt: new Date().toISOString(),
          }
        : c,
    );
    return HttpResponse.json(conversations.find((c) => c.id === params.id));
  }),

  // PATCH resolve
  http.patch("/api/conversations/:id/resolve", async ({ params }) => {
    await delay(DELAY_MS());
    conversations = conversations.map((c) =>
      c.id === params.id
        ? {
            ...c,
            status: "resolved" as const,
            waitingMinutes: 0,
            updatedAt: new Date().toISOString(),
          }
        : c,
    );
    return HttpResponse.json(conversations.find((c) => c.id === params.id));
  }),

  // PATCH transfer back to queue
  http.patch("/api/conversations/:id/transfer", async ({ params }) => {
    await delay(DELAY_MS());
    conversations = conversations.map((c) =>
      c.id === params.id
        ? {
            ...c,
            assignedAgent: null,
            status: "waiting" as const,
            updatedAt: new Date().toISOString(),
          }
        : c,
    );
    return HttpResponse.json(conversations.find((c) => c.id === params.id));
  }),
];
