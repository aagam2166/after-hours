import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, type UserProfile } from '../api/auth';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  sendOtp: (mobile: string) => Promise<{ message: string; mockCode?: string }>;
  verifyOtp: (mobile: string, code: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ah_token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (!localStorage.getItem('ah_token')) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      localStorage.removeItem('ah_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const sendOtp = async (mobile: string) => {
    return await authApi.sendOtp(mobile);
  };

  const verifyOtp = async (mobile: string, code: string) => {
    const res = await authApi.verifyOtp(mobile, code);
    if (res.token) {
      localStorage.setItem('ah_token', res.token);
      setToken(res.token);
      await refreshUser();
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('ah_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
