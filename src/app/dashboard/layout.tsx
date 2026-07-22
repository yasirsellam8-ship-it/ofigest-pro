"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"; // Importamos useState para manejar el menú

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para abrir/cerrar menú en móvil

  return (
    // Cambiamos a flex-col en móvil para apilar la barra superior, y flex-row en escritorio
    <div className="flex flex-col md:flex-row h-screen bg-slate-50">
      
      {/* 🔥 NUEVO: Barra superior SOLO para móviles */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 border-b border-slate-200 print:hidden z-40 relative">
        <h1 className="text-xl font-bold text-blue-600">OfiGest <span className="text-slate-800">PRO</span></h1>
        <button 
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {/* Icono de Hamburguesa que cambia a X cuando está abierto */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuAbierto ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 🔥 NUEVO: Fondo oscuro semitransparente cuando el menú está abierto en móvil */}
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-slate-800/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}

      {/* 🔥 EL MENÚ LATERAL: Animado y adaptable */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200 flex flex-col justify-between print:hidden
        transform transition-transform duration-300 ease-in-out
        ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div>
          {/* Logo (Lo ocultamos en móvil porque ya está en la barra superior nueva) */}
          <div className="p-6 hidden md:block">
            <h1 className="text-xl font-bold text-blue-600">OfiGest <span className="text-slate-800">PRO</span></h1>
            <p className="text-xs text-slate-400 mt-1">Panel de Control</p>
          </div>

          {/* Enlaces de Navegación */}
          <nav className="mt-6 md:mt-2 px-4 space-y-1">
            <Link 
              href="/dashboard" 
              onClick={() => setMenuAbierto(false)} // Cierra el menú al hacer clic
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>🏠</span> Inicio
            </Link>
            <Link 
              href="/dashboard/clientes" 
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/clientes' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>👥</span> Clientes
            </Link>
            <Link 
              href="/dashboard/presupuestos" 
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/presupuestos' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>💼</span> Presupuestos
            </Link>
            <Link 
              href="/dashboard/facturas" 
              onClick={() => setMenuAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === '/dashboard/facturas' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
            >
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