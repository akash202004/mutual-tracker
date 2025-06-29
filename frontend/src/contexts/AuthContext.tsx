import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthContextType, User } from "../types";
import {
  authApi,
  getStoredUser,
  storeUser,
  removeStoredUser,
} from "../utils/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      setUser(response.user);
      storeUser(response.user);
      // Store the token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.register(email, password, name);
      setUser(response.user);
      storeUser(response.user);
      // Store the token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    removeStoredUser();
    // Remove the token
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
