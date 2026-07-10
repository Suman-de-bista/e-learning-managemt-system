"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/common";
import { getCurrentUser, logoutUser } from "../apis/auths";

const SessionContext = createContext<{
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}>({ user: null, loading: true, refresh: async () => {}, logout: async () => {} });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setUser(await getCurrentUser());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
