export interface EndpointDefinition {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  tag: 'Authentication' | 'Client' | 'Staff' | 'Admin';
  summary: string;
  operationId: string;
  requiresAuth: boolean;
  requestSchemaName?: string;
  requestSchema?: Record<string, unknown>;
  defaultPayload?: Record<string, unknown>;
  successResponseSample: Record<string, unknown>;
  errorResponseSample: Record<string, unknown>;
  description: string;
}

export const OPENAPI_SPEC_INFO = {
  title: "Ticketer Server",
  version: "0.1.0",
  openapi: "3.1.0",
  totalEndpoints: 12,
  tags: ["Authentication", "Client", "Staff", "Admin"] as const
};

export const ENDPOINTS: EndpointDefinition[] = [
  // 1. Client Ticket Creation
  {
    id: "client-tickets-create",
    path: "/api/v1/client/tickets/create",
    method: "POST",
    tag: "Client",
    summary: "Create Ticket",
    operationId: "create_ticket_api_v1_client_tickets_create_post",
    requiresAuth: true,
    requestSchemaName: "CreateTicketRequest",
    requestSchema: {
      type: "object",
      required: ["text"],
      properties: {
        text: { type: "string", title: "Text", description: "Incident description or support request" }
      }
    },
    defaultPayload: {
      text: "Cluster node compute-gpu-04 failing with thermal throttle exception."
    },
    successResponseSample: {
      ticket_id: 1042,
      text: "Cluster node compute-gpu-04 failing with thermal throttle exception.",
      status: "OPEN",
      created_by: "clara.oswald@mit.edu",
      institute: "MIT-CSAIL",
      created_at: "2026-10-06T02:45:11.892Z",
      last_bump_time: null,
      assigned_email: null
    },
    errorResponseSample: {
      detail: [
        {
          loc: ["body", "text"],
          msg: "Field required",
          type: "missing"
        }
      ]
    },
    description: "Ingests a new support ticket from an authenticated institutional user. Automatically stamps tenant ID and enqueues to the triage pool."
  },

  // 2. Client Tickets All
  {
    id: "client-tickets-all",
    path: "/api/v1/client/tickets/all",
    method: "GET",
    tag: "Client",
    summary: "Get All Tickets By User",
    operationId: "get_all_tickets_by_user_api_v1_client_tickets_all_get",
    requiresAuth: true,
    successResponseSample: {
      tickets: [
        {
          ticket_id: 1042,
          text: "Cluster node compute-gpu-04 failing with thermal throttle exception.",
          status: "OPEN",
          created_at: "2026-10-06T02:45:11.892Z",
          assigned_email: null,
          last_bump_time: null
        },
        {
          ticket_id: 1039,
          text: "Requesting quota expansion for Quantum Simulation workspace.",
          status: "RESOLVED",
          created_at: "2026-10-05T19:12:04.110Z",
          assigned_email: "marcus.vance@mit.edu",
          last_bump_time: "2026-10-05T20:01:42.000Z"
        }
      ],
      total: 2
    },
    errorResponseSample: {
      detail: "Not authenticated"
    },
    description: "Retrieves all historical and active tickets filed by the currently authenticated client user."
  },

  // 3. Staff Ticket Update
  {
    id: "staff-tickets-update",
    path: "/api/v1/staff/tickets/update/{ticket_id}",
    method: "PUT",
    tag: "Staff",
    summary: "Update Ticket",
    operationId: "update_ticket_api_v1_staff_tickets_update__ticket_id__put",
    requiresAuth: true,
    requestSchemaName: "UpdateTicketRequest",
    requestSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["OPEN", "IN_PROGRESS", "BUMPED", "RESOLVED", "CLOSED"], title: "Status" },
        assigned_email: { type: "string", title: "Assigned Email" },
        last_bump_time: { type: "string", title: "Last Bump Time" }
      }
    },
    defaultPayload: {
      status: "IN_PROGRESS",
      assigned_email: "marcus.vance@mit.edu",
      last_bump_time: "2026-10-06T03:00:00.000Z"
    },
    successResponseSample: {
      ticket_id: 1042,
      status: "IN_PROGRESS",
      assigned_email: "marcus.vance@mit.edu",
      last_bump_time: "2026-10-06T03:00:00.000Z",
      updated_at: "2026-10-06T03:00:01.442Z"
    },
    errorResponseSample: {
      detail: [
        {
          loc: ["path", "ticket_id"],
          msg: "Input should be a valid integer",
          type: "int_type"
        }
      ]
    },
    description: "Staff operation to claim tickets, advance workflow state, update engineer assignments, and trigger SLA bump timestamps."
  },

  // 4. Admin All Tickets
  {
    id: "admin-tickets-all",
    path: "/api/v1/admin/tickets/all",
    method: "GET",
    tag: "Admin",
    summary: "Get All Tickets",
    operationId: "get_all_tickets_api_v1_admin_tickets_all_get",
    requiresAuth: true,
    successResponseSample: {
      tickets: [
        {
          ticket_id: 1042,
          institute: "MIT-CSAIL",
          created_by: "clara.oswald@mit.edu",
          text: "Cluster node compute-gpu-04 failing with thermal throttle exception.",
          status: "IN_PROGRESS",
          assigned_email: "marcus.vance@mit.edu"
        },
        {
          ticket_id: 1041,
          institute: "Stanford-AI",
          created_by: "david.chen@stanford.edu",
          text: "API Gateway rate limit quota reset required for ML benchmarks.",
          status: "OPEN",
          assigned_email: null
        },
        {
          ticket_id: 1040,
          institute: "CERN-DataLab",
          created_by: "elena.rostova@cern.ch",
          text: "Storage tier SAN 08 degraded parity check fail.",
          status: "BUMPED",
          assigned_email: "s.turing@cern.ch"
        }
      ],
      total_cross_institutional: 489
    },
    errorResponseSample: {
      detail: "Admin privileges required"
    },
    description: "Multi-tenant supervisory endpoint: returns cross-institutional tickets across all registered organizations."
  },

  // 5. Admin Create Ticket
  {
    id: "admin-tickets-create",
    path: "/api/v1/admin/tickets/create",
    method: "POST",
    tag: "Admin",
    summary: "Create Ticket on Behalf of User",
    operationId: "create_ticket_api_v1_admin_tickets_create_post",
    requiresAuth: true,
    requestSchemaName: "CreateTicketRequestAdmin",
    requestSchema: {
      type: "object",
      required: ["email", "text"],
      properties: {
        email: { type: "string", title: "Email", description: "Target recipient user email" },
        text: { type: "string", title: "Text", description: "Ticket description" }
      }
    },
    defaultPayload: {
      email: "director.sys@harvard.edu",
      text: "System wide emergency maintenance notification: core router firmware upgrade scheduled."
    },
    successResponseSample: {
      ticket_id: 1043,
      email: "director.sys@harvard.edu",
      text: "System wide emergency maintenance notification...",
      status: "OPEN",
      created_by_admin: "admin.super@ticketer.internal",
      created_at: "2026-10-06T03:01:10.000Z"
    },
    errorResponseSample: {
      detail: [
        {
          loc: ["body", "email"],
          msg: "Field required",
          type: "missing"
        }
      ]
    },
    description: "Enables administrative operators to spawn high-priority institutional tickets directly on behalf of any entity."
  },

  // 6. Auth Signup
  {
    id: "auth-signup",
    path: "/api/v1/auth/signup",
    method: "POST",
    tag: "Authentication",
    summary: "Sign Up",
    operationId: "sign_up_api_v1_auth_signup_post",
    requiresAuth: false,
    requestSchemaName: "CreateUserRequest",
    requestSchema: {
      type: "object",
      required: ["name", "email", "password", "institute"],
      properties: {
        name: { type: "string", title: "Name" },
        email: { type: "string", title: "Email" },
        password: { type: "string", title: "Password" },
        institute: { type: "string", title: "Institute" },
        role: { type: "string", title: "Role", default: "client" }
      }
    },
    defaultPayload: {
      name: "Dr. Aris Thorne",
      email: "a.thorne@oxford.ac.uk",
      password: "VaultKey#9842X*",
      institute: "Oxford-HighEnergy",
      role: "client"
    },
    successResponseSample: {
      user_id: 8841,
      name: "Dr. Aris Thorne",
      email: "a.thorne@oxford.ac.uk",
      institute: "Oxford-HighEnergy",
      role: "client",
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refresh_token: "rf_098234ab8e09f8d1c..."
    },
    errorResponseSample: {
      detail: [
        {
          loc: ["body", "institute"],
          msg: "Field required",
          type: "missing"
        }
      ]
    },
    description: "Registers a user and establishes institutional tenancy partitioning."
  },

  // 7. Auth Signin
  {
    id: "auth-signin",
    path: "/api/v1/auth/signin",
    method: "POST",
    tag: "Authentication",
    summary: "Signin",
    operationId: "signin_api_v1_auth_signin_post",
    requiresAuth: false,
    requestSchemaName: "LoginRequest",
    requestSchema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", title: "Email" },
        password: { type: "string", title: "Password" }
      }
    },
    defaultPayload: {
      email: "clara.oswald@mit.edu",
      password: "SecurePasscode2026!"
    },
    successResponseSample: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGFyYS5vc3dhbGR...",
      refresh_token: "rf_849204bc99f123...",
      token_type: "bearer",
      expires_in: 3600
    },
    errorResponseSample: {
      detail: "Invalid credentials"
    },
    description: "Exchanges verified email and password credentials for an institutional Bearer access token."
  },

  // 8. Auth Refresh
  {
    id: "auth-refresh",
    path: "/api/v1/auth/refresh",
    method: "POST",
    tag: "Authentication",
    summary: "Refresh Access Token",
    operationId: "refresh_access_token_api_v1_auth_refresh_post",
    requiresAuth: false,
    requestSchemaName: "RefreshTokenRequest",
    requestSchema: {
      type: "object",
      required: ["refresh_token"],
      properties: {
        refresh_token: { type: "string", title: "Refresh Token" }
      }
    },
    defaultPayload: {
      refresh_token: "rf_849204bc99f123_valid_sample"
    },
    successResponseSample: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyZWZyZXNoZWQuLi4",
      token_type: "bearer",
      expires_in: 3600
    },
    errorResponseSample: {
      detail: "Invalid or expired refresh token"
    },
    description: "Rotates expired access tokens without terminating active client sessions."
  },

  // 9. Users All
  {
    id: "users-all",
    path: "/api/v1/users/all",
    method: "GET",
    tag: "Admin",
    summary: "Get All Users",
    operationId: "get_all_users_api_v1_users_all_get",
    requiresAuth: true,
    successResponseSample: {
      users: [
        { id: 1, name: "Clara Oswald", email: "clara.oswald@mit.edu", institute: "MIT-CSAIL", role: "client" },
        { id: 2, name: "Marcus Vance", email: "marcus.vance@mit.edu", institute: "MIT-CSAIL", role: "staff" },
        { id: 3, name: "Sys Admin", email: "root@ticketer.internal", institute: "Global", role: "admin" }
      ],
      count: 3
    },
    errorResponseSample: {
      detail: "Forbidden"
    },
    description: "Institutional user directory inspection for tenant provisioning and role audits."
  },

  // 10. Client User Details
  {
    id: "client-users-details",
    path: "/api/v1/client/users/details",
    method: "GET",
    tag: "Client",
    summary: "Get User Details",
    operationId: "get_user_details_api_v1_client_users_details_get",
    requiresAuth: true,
    successResponseSample: {
      id: 101,
      name: "Clara Oswald",
      email: "clara.oswald@mit.edu",
      institute: "MIT-CSAIL",
      role: "client",
      tickets_filed: 14,
      sla_health_pct: 99.4
    },
    errorResponseSample: {
      detail: "Not authenticated"
    },
    description: "Inspects authenticated client tenant profile and SLA operational score."
  }
];
