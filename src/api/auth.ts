import { apiRequest, setAccessToken, setRefreshToken, clearTokens } from './client';
import { ApiResponse, AuthTokens } from '../types/api';

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams {
  name: string;
  email: string;
  password: string;
  institute: string;
  role?: string;
}

export interface VerifyParams {
  email: string;
  otp: string;
}

export const signinApi = async (params: LoginParams): Promise<ApiResponse<AuthTokens>> => {
  const res = await apiRequest<AuthTokens>('/api/v1/auth/signin', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (res.data?.access_token) {
    setAccessToken(res.data.access_token);
  }
  if (res.data?.refresh_token) {
    setRefreshToken(res.data.refresh_token);
  }

  return res;
};

export const signupApi = async (params: SignupParams): Promise<ApiResponse<{ user: number }>> => {
  return await apiRequest<{ user: number }>('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const verifyApi = async (params: VerifyParams): Promise<ApiResponse<null>> => {
  return await apiRequest<null>('/api/v1/auth/verify', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const refreshApi = async (refreshToken: string): Promise<ApiResponse<{ access_token: string }>> => {
  const res = await apiRequest<{ access_token: string }>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (res.data?.access_token) {
    setAccessToken(res.data.access_token);
  }
  return res;
};

export const signoutApi = async (): Promise<ApiResponse<null>> => {
  try {
    const res = await apiRequest<null>('/api/v1/auth/signout', {
      method: 'POST',
    });
    return res;
  } finally {
    clearTokens();
  }
};
