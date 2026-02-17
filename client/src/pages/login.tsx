import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return alert("Login failed");
    const data = await res.json();
    login(data);
    nav("/");
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm mx-auto mt-20">
      <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border" />
      <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
    </form>
  );
}