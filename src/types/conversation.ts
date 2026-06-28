export type Priority = "urgent" | "high" | "normal";
export type Status = "waiting" | "active" | "resolved";
export type Channel = "chat" | "email" | "whatsapp" | "phone";
export interface QueueStats {
  urgent: number;
  high: number;
  normal: number;

  waiting: number;
  active: number;
  resolved: number;

  assigned: number;
  escalated: number;

  oldestWait: number;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  channel: Channel;
  lastMessage: string;
  aiSummary: string;
  failureReason: string;
  priority: Priority;
  status: Status;
  waitingMinutes: number;
  satisfactionScore: number; // 1–5
  tags: string[];
  assignedAgent: string | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  priorityReason?: string;
  businessImpact?: string;
}

export type SortKey = "priority" | "waitTime" | "satisfaction" | "recent";
export type FilterStatus = "all" | Status;
export type FilterPriority = "all" | Priority;

export interface Filters {
  status: FilterStatus;
  priority: FilterPriority;
  search: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
}
