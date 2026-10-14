import { apiRequest } from './client';
import { ApiResponse, Ticket, CreateTicketResponseData } from '../types/api';

export interface UpdateTicketParams {
  status?: string;
  assigned_email?: string;
  last_bump_time?: string;
}

// Client Ticket APIs
export const getClientTicketsApi = async (): Promise<ApiResponse<{ tickets: Ticket[] }>> => {
  return await apiRequest<{ tickets: Ticket[] }>('/api/v1/client/tickets/all', {
    method: 'GET',
  });
};

export const createClientTicketApi = async (text: string): Promise<ApiResponse<CreateTicketResponseData>> => {
  return await apiRequest<CreateTicketResponseData>('/api/v1/client/tickets/create', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

// Staff Ticket APIs
export const getStaffTicketsApi = async (): Promise<ApiResponse<{ tickets: Ticket[] }>> => {
  return await apiRequest<{ tickets: Ticket[] }>('/api/v1/staff/tickets/all', {
    method: 'GET',
  });
};

export const updateStaffTicketApi = async (
  ticketId: number,
  params: UpdateTicketParams
): Promise<ApiResponse<{ ticket: Ticket }>> => {
  return await apiRequest<{ ticket: Ticket }>(`/api/v1/staff/tickets/update/${ticketId}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
};

// Admin Ticket APIs
export const getAdminTicketsApi = async (): Promise<ApiResponse<{ tickets: Ticket[] }>> => {
  return await apiRequest<{ tickets: Ticket[] }>('/api/v1/admin/tickets/all', {
    method: 'GET',
  });
};

export const createAdminTicketApi = async (
  email: string,
  text: string
): Promise<ApiResponse<CreateTicketResponseData>> => {
  return await apiRequest<CreateTicketResponseData>('/api/v1/admin/tickets/create', {
    method: 'POST',
    body: JSON.stringify({ email, text }),
  });
};
