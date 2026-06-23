"use client";

import { useState, useEffect } from "react";

export default function DashboardHomePage() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    presupuestosPendientes: 0,
    facturacionTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarEstadisticas() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error al conectar con la API de estadísticas:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarEstadisticas();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Panel de Inicio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Total Clientes</h3>
          <p className="mt-2 text-3xl font-bold text-slate-800">
            {loading ? <span className="text-slate-300 animate-pulse">...</span> : stats.totalClientes}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Presupuestos Pendientes</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {loading ? <span className="text-blue-200 animate-pulse">...</span> : stats.presupuestosPendientes}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Facturación Total</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {loading ? <span className="text-green-200 animate-pulse">...</span> : `${stats.facturacionTotal.toFixed(2)} €`}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Bienvenido a OfiGest PRO</h3>
        <p className="text-slate-600">
          El cuadro de mandos está completamente sincronizado con tu base de datos local. 
          Cualquier cliente, presupuesto o factura que registres en las otras secciones modificará 
          estos indicadores en tiempo real.
        </p>
      </div>
    </div>
  );
}