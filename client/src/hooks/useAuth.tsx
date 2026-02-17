import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [auth, setAuth] = useState<any>(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload: any) => { localStorage.setItem("auth", JSON.stringify(payload)); setAuth(payload); };
  const logout = () => { localStorage.removeItem("auth"); setAuth(null); };

  return <AuthContext.Provider value={{ auth, user: auth?.user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }