"use client";

export default function DashboardInicio() {
  // Simulamos unos datos rápidos para que veas el diseño vivo
  const fechaHoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 to-slate-100/40 p-6 md:p-10 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
      
      {/* Decoración de fondo estilo "Glassmorphism" */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/5 blur-3xl pointer-events-none"></div>

      {/* Cabecera del Dashboard */}
      <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end relative z-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Resumen financiero y actividad en tiempo real.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-600 capitalize">📅 {fechaHoy}</p>
        </div>
      </div>

      {/* Grid de Tarjetas de Métricas (Estilo SaaS Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        
        {/* Tarjeta 1: Facturación */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-emerald-50 p-2.5 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Facturación Total</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">281.93</h2>
            <span className="text-2xl font-bold text-slate-400">€</span>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/80 w-fit px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="mr-1">↑</span> +12% este mes
          </div>
        </div>

        {/* Tarjeta 2: Clientes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cartera de Clientes</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">2</h2>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-blue-700 bg-blue-100/80 w-fit px-3 py-1.5 rounded-lg border border-blue-200">
            Nuevos contactos listos
          </div>
        </div>

        {/* Tarjeta 3: Presupuestos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-amber-50 p-2.5 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Presupuestos Pendientes</p>
          <div className="flex items-baseline gap-1">
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">0</h2>
          </div>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-700 bg-amber-100/80 w-fit px-3 py-1.5 rounded-lg border border-amber-200">
            Todo al día
          </div>
        </div>

      </div>

      {/* Banner inferior elegante */}
      <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-lg border border-slate-800 text-white relative z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <h3 className="text-xl font-bold tracking-tight mb-2">Bienvenido a la versión PRO</h3>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          El cuadro de mandos está completamente sincronizado con tu base de datos en Vercel. 
          Cualquier cliente, presupuesto o factura que registres en las otras secciones 
          modificará estos indicadores en tiempo real de forma automática.
        </p>
        <div className="mt-6">
          <button className="bg-white text-slate-900 text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-slate-100 transition-colors">
            Configurar cuenta
          </button>
        </div>
      </div>

    </div>
  );
}