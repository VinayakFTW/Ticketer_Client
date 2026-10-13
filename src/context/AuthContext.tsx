import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types/api';
import { 
  getAccessToken, 
  decodeJwtPayload, 
  clearTokens 
} from '../api/client';
import { 
  signinApi, 
  signupApi, 
  verifyApi, 
  signoutApi, 
  LoginParams, 
  SignupParams, 
  VerifyParams 
} from '../api/auth';
import { getClientUserDetailsApi, getClientSubscriptionApi } from '../api/users';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubscribed: boolean;
  login: (params: LoginParams) => Promise<UserRole>;
  signup: (params: SignupParams) => Promise<number | undefined>;
  verify: (params: VerifyParams) => Promise<void>;
  logout: () => Promise<void>;
  checkSubscription: () => Promise<boolean>;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Initialize from token in localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const payload = decodeJwtPayload(token);
      if (!payload) {
        clearTokens();
        setIsLoading(false);
        return;
      }

      // Extract verified role from JWT claims
      const rawRole = (payload.role as string)?.toUpperCase();
      const validRole: UserRole = rawRole === 'ADMIN' ? 'ADMIN' : rawRole === 'STAFF' ? 'STAFF' : 'STUDENT';

      setRole(validRole);
      setIsAuthenticated(true);

      // Fetch user profile from server
      try {
        const detailsRes = await getClientUserDetailsApi();
        if (detailsRes.data?.user) {
          setUser({
            ...detailsRes.data.user,
            role: validRole,
          });
        } else {
          setUser({
            user_id: Number(payload.sub) || 1,
            username: (payload.username as string) || (payload.email as string)?.split('@')[0] || 'User',
            email: (payload.email as string) || 'student@sitpune.edu.in',
            institute: 'Symbiosis Institute of Technology',
            role: validRole,
          });
        }
      } catch {
        setUser({
          user_id: Number(payload.sub) || 1,
          username: (payload.username as string) || (payload.email as string)?.split('@')[0] || 'User',
          email: (payload.email as string) || 'student@sitpune.edu.in',
          institute: 'Symbiosis Institute of Technology',
          role: validRole,
        });
      }

      // Check subscription if student
      if (validRole === 'STUDENT') {
        try {
          const subRes = await getClientSubscriptionApi();
          setIsSubscribed(Boolean(subRes.data?.active));
        } catch {
          setIsSubscribed(false);
        }
      } else {
        // Staff and Admin are exempt from student subscription
        setIsSubscribed(true);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const checkSubscription = async (): Promise<boolean> => {
    try {
      const subRes = await getClientSubscriptionApi();
      const active = Boolean(subRes.data?.active);
      setIsSubscribed(active);
      return active;
    } catch {
      setIsSubscribed(false);
      return false;
    }
  };

  const login = async (params: LoginParams): Promise<UserRole> => {
    setIsLoading(true);
    try {
      const res = await signinApi(params);
      const token = res.data?.access_token;
      if (!token) throw new Error('No access token received from authentication server');

      const payload = decodeJwtPayload(token);
      const rawRole = (payload?.role as string)?.toUpperCase();
      const userRole: UserRole = rawRole === 'ADMIN' ? 'ADMIN' : rawRole === 'STAFF' ? 'STAFF' : 'STUDENT';

      setRole(userRole);
      setIsAuthenticated(true);

      // Fetch user profile
      try {
        const detailsRes = await getClientUserDetailsApi();
        if (detailsRes.data?.user) {
          setUser({
            ...detailsRes.data.user,
            role: userRole,
          });
        } else {
          setUser({
            user_id: Number(payload?.sub) || 1,
            username: params.email.split('@')[0],
            email: params.email,
            institute: 'Symbiosis Institute of Technology',
            role: userRole,
          });
        }
      } catch {
        setUser({
          user_id: Number(payload?.sub) || 1,
          username: params.email.split('@')[0],
          email: params.email,
          institute: 'Symbiosis Institute of Technology',
          role: userRole,
        });
      }

      // Check subscription for students
      if (userRole === 'STUDENT') {
        try {
          const subRes = await getClientSubscriptionApi();
          const active = Boolean(subRes.data?.active);
          setIsSubscribed(active);
        } catch {
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(true);
      }

      return userRole;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (params: SignupParams): Promise<number | undefined> => {
    const res = await signupApi(params);
    return res.data?.user;
  };

  const verify = async (params: VerifyParams): Promise<void> => {
    await verifyApi(params);
  };

  const logout = async (): Promise<void> => {
    try {
      await signoutApi();
    } catch {
      // ignore
    } finally {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setIsSubscribed(false);
      setRole('STUDENT');
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        isSubscribed,
        login,
        signup,
        verify,
        logout,
        checkSubscription,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
