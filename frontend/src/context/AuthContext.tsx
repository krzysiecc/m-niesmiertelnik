import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { setAccessToken } from '../lib/api';

interface AuthContextType {
  userId: string | null;
  login: (id: string, accessToken?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ID_KEY = 'userId';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Persist the user id (and JWT access token, via lib/api) in localStorage so a
  // page refresh keeps the user logged in.
  const [userId, setUserId] = useState<string | null>(
    () => localStorage.getItem(USER_ID_KEY),
  );

  const login = (id: string, accessToken?: string | null) => {
    setUserId(id);
    localStorage.setItem(USER_ID_KEY, id);
    if (accessToken !== undefined) setAccessToken(accessToken);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem(USER_ID_KEY);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the auth context (co-located with its provider).
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
