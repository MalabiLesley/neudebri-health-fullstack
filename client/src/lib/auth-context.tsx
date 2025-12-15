import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (role: "patient" | "doctor" | "admin") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("neudebri-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("neudebri-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("neudebri-user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("neudebri-user");
  };

  const switchUser = async (role: "patient" | "doctor" | "admin") => {
    try {
      const response = await fetch(`/api/auth/demo/${role}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("neudebri-user", JSON.stringify(data.user));
      }
    } catch {
      console.error("Failed to switch user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
