"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* 🔥 AQUÍ ESTÁ LA MAGIA: El "print:hidden" hace que el menú no salga en el PDF */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between print:hidden">
        <div>
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-xl font-bold text-blue-600">OfiGest <span className="text-slate-800">PRO</span></h1>
            <p className="text-xs text-slate-400 mt-1">Panel de Control</p>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="mt-2 px-4 space-y-1">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>🏠</span> Inicio
            </Link>
            <Link href="/dashboard/clientes" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/clientes' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>👥</span> Clientes
            </Link>
            <Link href="/dashboard/presupuestos" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/presupuestos' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>💼</span> Presupuestos
            </Link>
            <Link href="/dashboard/facturas" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/facturas' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>📄</span> Facturas
            </Link>
          </nav>
        </div>

        {/* Footer: Cerrar Sesión */}
        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full p-2 hover:bg-red-50 rounded-lg transition-colors group">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              N
            </div>
            <span className="text-sm font-semibold text-red-600 group-hover:text-red-700">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenedor del contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}