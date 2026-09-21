import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthContextValue {
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextValue>({ isAuthenticated: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    /* reserved for future bootstrap (e.g., fetch /me) */
  }, [token]);
  return <AuthContext.Provider value={{ isAuthenticated: !!token }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);