"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // 1. FORZAMOS LA COOKIE EN EL CLIENTE (A prueba de balas)
        document.cookie = "ofigest_auth=true; path=/; max-age=86400; SameSite=Lax";

        // 2. Esperamos un suspiro para que el navegador la asimile y redirigimos
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        setError("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    } catch (err) {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter">OfiGest PRO</h1>
          <p className="text-slate-500 mt-2">Acceso al panel de gestión</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500" 
              placeholder="Ej: admin"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500" 
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}