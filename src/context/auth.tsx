import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthApi } from "@/api/auth";
import { FormRequestData, FormResponseData, RefreshTokenRequest, UserModel } from "@/types/form";

interface AuthContextType {
  user: UserModel | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: FormRequestData) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<boolean>;
  setTokens: (access: string, refresh: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Load tokens and user from localStorage on mount
  useEffect(() => {
    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save tokens and user to localStorage when they change
  useEffect(() => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [accessToken, refreshToken, user]);

  const setTokens = useCallback((access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  }, []);

  const login = useCallback(async (data: FormRequestData) => {
    const res = await AuthApi.login(data);
    if (res && res.success && res.access_token && res.refresh_token && res.user) {
      setTokens(res.access_token, res.refresh_token);
      setUser(res.user);
      return true;
    }
    return false;
  }, [setTokens]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!user || !refreshToken) return false;
    const res = await AuthApi.refreshToken({ refresh_token: refreshToken } as RefreshTokenRequest);
    if (res && res.success && res.access_token && res.refresh_token) {
      setTokens(res.access_token, res.refresh_token);
      return true;
    } else {
      logout();
      return false;
    }
  }, [user, refreshToken, setTokens, logout]);

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, isAuthenticated, login, logout, refresh, setTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
