import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthApi } from "@/api/auth";
import { FormRequestData, FormResponseData, RefreshTokenRequest, UserModel } from "@/types/form";

interface AuthContextType {
  user: UserModel | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  isAuthenticated: boolean;
  login: (data: FormRequestData) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<boolean>;
  setTokens: (access: string, refresh: string, accessExp?: string, refreshExp?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_EXP_KEY = "access_token_expires_at";
const REFRESH_TOKEN_EXP_KEY = "refresh_token_expires_at";
const USER_KEY = "user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<string | null>(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState<string | null>(null);

  // Load tokens and user from localStorage on mount
  useEffect(() => {
    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedAccessExp = localStorage.getItem(ACCESS_TOKEN_EXP_KEY);
    const storedRefreshExp = localStorage.getItem(REFRESH_TOKEN_EXP_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedAccessExp) setAccessTokenExpiresAt(storedAccessExp);
    if (storedRefreshExp) setRefreshTokenExpiresAt(storedRefreshExp);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save tokens and user to localStorage when they change
  useEffect(() => {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
    if (accessTokenExpiresAt) localStorage.setItem(ACCESS_TOKEN_EXP_KEY, accessTokenExpiresAt);
    else localStorage.removeItem(ACCESS_TOKEN_EXP_KEY);
    if (refreshTokenExpiresAt) localStorage.setItem(REFRESH_TOKEN_EXP_KEY, refreshTokenExpiresAt);
    else localStorage.removeItem(REFRESH_TOKEN_EXP_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, user]);

  const setTokens = useCallback((access: string, refresh: string, accessExp?: string, refreshExp?: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    if (accessExp) setAccessTokenExpiresAt(accessExp);
    if (refreshExp) setRefreshTokenExpiresAt(refreshExp);
  }, []);

  const login = useCallback(async (data: FormRequestData) => {
    const res = await AuthApi.login(data);
    if (res && res.success && res.access_token && res.refresh_token && res.user) {
      setTokens(
        res.access_token,
        res.refresh_token,
        res.access_token_expires_at,
        res.refresh_token_expires_at
      );
      setUser(res.user);
      return true;
    }
    return false;
  }, [setTokens]);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setAccessTokenExpiresAt(null);
    setRefreshTokenExpiresAt(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXP_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXP_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!refreshToken) return false;
    const res = await AuthApi.refreshToken({ refresh_token: refreshToken } as RefreshTokenRequest);
    if (res && res.success && res.access_token && res.refresh_token) {
      setTokens(
        res.access_token,
        res.refresh_token,
        res.access_token_expires_at,
        res.refresh_token_expires_at
      );
      return true;
    } else {
      logout();
      return false;
    }
  }, [refreshToken, setTokens, logout]);

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      isAuthenticated,
      login,
      logout,
      refresh,
      setTokens
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
