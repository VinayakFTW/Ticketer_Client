export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';

export type TicketStatus = 
  | 'open' 
  | 'auto_replied' 
  | 'in_progress' 
  | 'escalated' 
  | 'resolved' 
  | 'closed'
  | 'OPEN'
  | 'AUTO_REPLIED'
  | 'IN_PROGRESS'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'URGENT' | 'CRITICAL';

export interface Ticket {
  ticket_id: number;
  user_id?: number;
  text: string;
  summary?: string | null;
  department?: string | null;
  priority?: TicketPriority | string | null;
  is_safety_grievance?: boolean | null;
  status: TicketStatus;
  assigned_email?: string | null;
  bump_count: number;
  created_at: string;
  last_bump_time?: string | null;
}

export interface UserProfile {
  user_id: number;
  username: string;
  email: string;
  institute: string;
  role?: UserRole;
}

export interface SubscriptionInfo {
  active: boolean;
  user_id?: number;
  renewed_at?: string;
}

export interface LayaDecision {
  department: string;
  priority: string;
  is_safety_grievance: boolean;
  confidence?: number;
  reasoning?: string;
}

export interface CreateTicketResponseData {
  ticket_id: number;
  summary?: string | null;
  laya_decision?: {
    decision: LayaDecision;
  } | LayaDecision;
}

export interface ApiResponse<T = unknown> {
  status_code?: number;
  message?: string;
  data?: T;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
