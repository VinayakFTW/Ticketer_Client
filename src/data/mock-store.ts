export interface SimulatedTicket {
  ticket_id: number;
  text: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'BUMPED' | 'RESOLVED' | 'CLOSED';
  created_by: string;
  institute: string;
  created_at: string;
  assigned_email: string | null;
  last_bump_time: string | null;
  bump_count: number;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  tracking_hash: string;
}

export interface SimulatedUser {
  id: number;
  name: string;
  email: string;
  institute: string;
  role: 'client' | 'staff' | 'admin';
}

const INITIAL_USERS: SimulatedUser[] = [
  { id: 1, name: "Clara Oswald", email: "clara.oswald@mit.edu", institute: "MIT-CSAIL", role: "client" },
  { id: 2, name: "Marcus Vance", email: "marcus.vance@mit.edu", institute: "MIT-CSAIL", role: "staff" },
  { id: 3, name: "Dr. Elena Vance", email: "e.vance@cern.ch", institute: "CERN-DataLab", role: "staff" },
  { id: 4, name: "David Chen", email: "david.chen@stanford.edu", institute: "Stanford-AI", role: "client" },
  { id: 5, name: "System Overseer", email: "root@ticketer.internal", institute: "Global", role: "admin" }
];

const INITIAL_TICKETS: SimulatedTicket[] = [
  {
    ticket_id: 1042,
    text: "Compute cluster node compute-gpu-04 failing with thermal throttle exception under multi-node distributed gradient sync.",
    status: "IN_PROGRESS",
    created_by: "clara.oswald@mit.edu",
    institute: "MIT-CSAIL",
    created_at: "2026-10-06T02:40:12Z",
    assigned_email: "marcus.vance@mit.edu",
    last_bump_time: "2026-10-06T02:55:00Z",
    bump_count: 2,
    priority: "HIGH",
    tracking_hash: "0x7F9B1E"
  },
  {
    ticket_id: 1041,
    text: "Institutional API Gateway rate limit quota threshold reached on production inference cluster.",
    status: "OPEN",
    created_by: "david.chen@stanford.edu",
    institute: "Stanford-AI",
    created_at: "2026-10-06T02:48:30Z",
    assigned_email: null,
    last_bump_time: null,
    bump_count: 0,
    priority: "NORMAL",
    tracking_hash: "0x892A4C"
  },
  {
    ticket_id: 1040,
    text: "High-energy storage tier SAN parity degradation detected during continuous beam telemetry ingestion.",
    status: "BUMPED",
    created_by: "elena.rostova@cern.ch",
    institute: "CERN-DataLab",
    created_at: "2026-10-06T01:15:00Z",
    assigned_email: "e.vance@cern.ch",
    last_bump_time: "2026-10-06T02:58:22Z",
    bump_count: 3,
    priority: "CRITICAL",
    tracking_hash: "0xCF1402"
  },
  {
    ticket_id: 1039,
    text: "Authorization token refresh failure on automated headless test runners across tenant boundaries.",
    status: "RESOLVED",
    created_by: "clara.oswald@mit.edu",
    institute: "MIT-CSAIL",
    created_at: "2026-10-05T20:10:00Z",
    assigned_email: "marcus.vance@mit.edu",
    last_bump_time: "2026-10-05T21:40:00Z",
    bump_count: 1,
    priority: "NORMAL",
    tracking_hash: "0x00E239"
  }
];

class MockTicketerStore {
  private tickets: SimulatedTicket[] = [...INITIAL_TICKETS];
  private users: SimulatedUser[] = [...INITIAL_USERS];
  private listeners: Set<() => void> = new Set();
  private nextId = 1043;

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getTickets(): SimulatedTicket[] {
    return [...this.tickets];
  }

  public getClientTickets(email: string = "clara.oswald@mit.edu"): SimulatedTicket[] {
    return this.tickets.filter(t => t.created_by === email);
  }

  public getUsers(): SimulatedUser[] {
    return [...this.users];
  }

  public createClientTicket(text: string, institute: string = "MIT-CSAIL", email: string = "clara.oswald@mit.edu"): SimulatedTicket {
    const newTicket: SimulatedTicket = {
      ticket_id: this.nextId++,
      text: text.trim(),
      status: "OPEN",
      created_by: email,
      institute: institute,
      created_at: new Date().toISOString(),
      assigned_email: null,
      last_bump_time: null,
      bump_count: 0,
      priority: text.toLowerCase().includes("urgent") || text.toLowerCase().includes("crash") ? "HIGH" : "NORMAL",
      tracking_hash: "0x" + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')
    };

    this.tickets = [newTicket, ...this.tickets];
    this.notify();
    return newTicket;
  }

  public updateTicketStatus(
    ticketId: number, 
    status?: 'OPEN' | 'IN_PROGRESS' | 'BUMPED' | 'RESOLVED' | 'CLOSED',
    assignedEmail?: string | null
  ): SimulatedTicket | null {
    const idx = this.tickets.findIndex(t => t.ticket_id === ticketId);
    if (idx === -1) return null;

    const t = this.tickets[idx];
    const updated: SimulatedTicket = {
      ...t,
      status: status || t.status,
      assigned_email: assignedEmail !== undefined ? assignedEmail : t.assigned_email
    };

    this.tickets[idx] = updated;
    this.notify();
    return updated;
  }

  public bumpTicket(ticketId: number): SimulatedTicket | null {
    const idx = this.tickets.findIndex(t => t.ticket_id === ticketId);
    if (idx === -1) return null;

    const t = this.tickets[idx];
    const bumpCount = t.bump_count + 1;
    const updated: SimulatedTicket = {
      ...t,
      status: "BUMPED",
      last_bump_time: new Date().toISOString(),
      bump_count: bumpCount,
      priority: bumpCount >= 2 ? "CRITICAL" : "HIGH"
    };

    this.tickets[idx] = updated;
    this.notify();
    return updated;
  }

  public resetStore() {
    this.tickets = [...INITIAL_TICKETS];
    this.notify();
  }
}

export const mockStore = new MockTicketerStore();
