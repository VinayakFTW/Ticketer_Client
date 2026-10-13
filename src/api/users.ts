import { apiRequest } from './client';
import { ApiResponse, UserProfile, SubscriptionInfo } from '../types/api';

export interface UpdateUserDetailsParams {
  name?: string;
  email?: string;
  password?: string;
  institute?: string;
  role?: string;
}

// Client User APIs
export const getClientUserDetailsApi = async (): Promise<ApiResponse<{ user: UserProfile }>> => {
  return await apiRequest<{ user: UserProfile }>('/api/v1/client/users/details', {
    method: 'GET',
  });
};

export const updateClientUserDetailsApi = async (
  data: UpdateUserDetailsParams
): Promise<ApiResponse<{ user: UserProfile }>> => {
  return await apiRequest<{ user: UserProfile }>('/api/v1/client/users/update', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getClientSubscriptionApi = async (): Promise<ApiResponse<SubscriptionInfo>> => {
  return await apiRequest<SubscriptionInfo>('/api/v1/client/users/subscription', {
    method: 'GET',
  });
};

export const renewClientSubscriptionApi = async (
  active: boolean = true
): Promise<ApiResponse<SubscriptionInfo>> => {
  return await apiRequest<SubscriptionInfo>('/api/v1/client/users/subscription/renew', {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};

// Admin User APIs
export const getAdminUsersApi = async (): Promise<ApiResponse<{ users: UserProfile[] }>> => {
  return await apiRequest<{ users: UserProfile[] }>('/api/v1/admin/users/all', {
    method: 'GET',
  });
};

export const getAdminUserSubscriptionApi = async (
  userId: number
): Promise<ApiResponse<SubscriptionInfo>> => {
  return await apiRequest<SubscriptionInfo>(`/api/v1/admin/users/subscription/${userId}`, {
    method: 'GET',
  });
};

export const renewAdminUserSubscriptionApi = async (
  userId: number,
  active: boolean = true
): Promise<ApiResponse<SubscriptionInfo>> => {
  return await apiRequest<SubscriptionInfo>(`/api/v1/admin/users/subscription/renew/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ active }),
  });
};
