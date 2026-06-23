"use client";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col justify-between">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-black text-blue-600 tracking-tighter">OfiGest PRO</h1>
            <p className="text-xs text-slate-400">Panel de Control</p>
          </div>

          <nav className="space-y-1">
            <a href="/dashboard" className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              🏠 Inicio
            </a>
            <a href="/dashboard/clientes" className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              👥 Clientes
            </a>
            <a href="/dashboard/presupuestos" className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              💼 Presupuestos
            </a>
            <a href="/dashboard/facturas" className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              📄 Facturas
            </a>
          </nav>
        </div>

        <div className="border-t pt-4">
          <button 
            onClick={() => {
              document.cookie = "ofigest_auth=; path=/; max-age=0;";
              window.location.href = "/login";
            }}
            className="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}