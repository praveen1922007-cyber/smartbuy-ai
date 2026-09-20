import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sb_token');
    if (stored) setToken(stored);
  }, []);

  const signIn = (newToken: string) => {
    localStorage.setItem('sb_token', newToken);
    setToken(newToken);
  };

  const signOut = () => {
    localStorage.removeItem('sb_token');
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
