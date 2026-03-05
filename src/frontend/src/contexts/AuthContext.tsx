// ==========================================
// AUTH CONTEXT - Session management
// ==========================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, getItem, removeItem, setItem } from "../lib/storage";
import type { LocalUser, Session } from "../types";

interface AuthContextType {
  session: Session | null;
  currentUser: LocalUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (user: LocalUser) => void;
  logout: () => void;
  refreshCurrentUser: (users: LocalUser[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const storedSession = getItem<Session>(STORAGE_KEYS.SESSION);
    if (storedSession) {
      setSession(storedSession);
    }
  }, []);

  const login = useCallback((user: LocalUser) => {
    const sess: Session = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    setSession(sess);
    setCurrentUser(user);
    setItem(STORAGE_KEYS.SESSION, sess);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setCurrentUser(null);
    removeItem(STORAGE_KEYS.SESSION);
  }, []);

  const refreshCurrentUser = useCallback(
    (users: LocalUser[]) => {
      if (session) {
        const user = users.find((u) => u.id === session.userId);
        if (user) setCurrentUser(user);
      }
    },
    [session],
  );

  const isLoggedIn = session !== null;
  const isAdmin = session?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        session,
        currentUser,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
