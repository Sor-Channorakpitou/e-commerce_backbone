import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types';

// Step 1: Create Context with undefined initial value to enforce Provider usage
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Step 2: Implement AuthProvider from scratch
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (email: string, name?: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const extractedName = name?.trim() || trimmedEmail.split('@')[0];
    const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    setUser({
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      name: formattedName,
      role: 'Member',
    });
  };

  const signOut = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Step 3: Custom hook with strict consumer boundary check
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
