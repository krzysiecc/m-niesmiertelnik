// src/contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // For this hackathon, we'll store the user ID in state.
  // In a real app, you'd use localStorage or cookies with a JWT.
  const [userId, setUserId] = useState<string | null>(null);

  const login = (id: string) => {
    setUserId(id);
    console.log(`User logged in with ID: ${id}`);
  };

  const logout = () => {
    setUserId(null);
    console.log("User logged out.");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};