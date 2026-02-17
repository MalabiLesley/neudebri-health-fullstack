export async function apiFetch(path: string, opts: RequestInit = {}) {
  const base = import.meta.env.VITE_API_URL ?? "";
  const raw = localStorage.getItem("auth");
  const token = raw ? JSON.parse(raw).token : null;
  const headers: Record<string,string> = { "Content-Type": "application/json", ...(opts.headers as any) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}