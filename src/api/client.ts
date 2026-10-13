import { ApiResponse } from '../types/api';

const TOKEN_KEY = 'tk_access_token';
const REFRESH_KEY = 'tk_refresh_token';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_KEY, token);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};
const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      // If unauthorized and we have a refresh token, try refreshing once
      if (response.status === 401 && getRefreshToken()) {
        const refreshSuccess = await tryRefreshToken();
        if (refreshSuccess) {
          // Retry the original request
          headers.set('Authorization', `Bearer ${getAccessToken()}`);
          const retryRes = await fetch(url, { ...options, headers });
          if (retryRes.ok) {
            return (await retryRes.json()) as ApiResponse<T>;
          }
        }
      }

      const errorMsg = data?.message || data?.detail || `HTTP ${response.status} error`;
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    return (data || {}) as ApiResponse<T>;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

async function tryRefreshToken(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.access_token) {
        setAccessToken(data.data.access_token);
        return true;
      }
    }
  } catch {
    // refresh failed
  }
  clearTokens();
  return false;
}
