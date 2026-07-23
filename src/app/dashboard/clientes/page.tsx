"use client";

import { useState, useEffect } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [cif, setCif] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const cargarClientes = async () => {
    const res = await fetch("/api/customers");
    if (res.ok) {
      const data = await res.json();
      setClientes(data);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const abrirNuevoCliente = () => {
    setEditingId(null);
    setName(""); setCif(""); setPhone(""); setEmail("");
    setIsModalOpen(true);
  };

  const abrirEditarCliente = (cliente: any) => {
    setEditingId(cliente.id);
    setName(cliente.name);
    setCif(cliente.cif || "");
    setPhone(cliente.phone || "");
    setEmail(cliente.email || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const metodo = editingId ? "PUT" : "POST";
    const datosEnvio = editingId 
      ? { id: editingId, name, cif, phone, email }
      : { name, cif, phone, email };

    const res = await fetch("/api/customers", {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEnvio),
    });

    if (res.ok) {
      setIsModalOpen(false);
      cargarClientes(); 
    } else {
      alert("❌ Hubo un problema al guardar.");
    }
  };

  const borrarCliente = async (id: string) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres borrar este cliente? Esta acción no se puede deshacer.");
    if (!confirmacion) return;

    const res = await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      cargarClientes();
    } else {
      alert("❌ Hubo un problema al borrar.");
    }
  };

  return (
    // 🔥 EL FONDO GRIS PREMIUM
    <div className="min-h-[85vh] bg-slate-50 p-6 md:p-8 rounded-2xl">
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Cartera de Clientes</h2>
        <button 
          onClick={abrirNuevoCliente}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* 🔥 LA CAJA FLOTANTE (Ahora con scroll horizontal adaptado) */}
      <div className="overflow-x-auto w-full rounded-xl border border-slate-200 bg-white shadow-md">
        
        {/* 🔥 LA TABLA (Con ancho mínimo para forzar el scroll en móviles) */}
        <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          
          <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Nombre o Empresa</th>
              <th className="p-4">CIF / NIF</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-blue-50 p-5 rounded-full shadow-inner mb-2">
                      <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Aún no tienes clientes</h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Añade tu primer cliente haciendo clic en el botón superior para empezar a crear presupuestos.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="p-4 font-medium text-slate-800">{cliente.name}</td>
                  <td className="p-4 text-slate-600">{cliente.cif || "—"}</td>
                  <td className="p-4 text-slate-600">{cliente.phone || "—"}</td>
                  <td className="p-4 text-slate-600">{cliente.email || "—"}</td>
                  <td className="p-4 text-right space-x-4">
                    <button 
                      onClick={() => abrirEditarCliente(cliente)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => borrarCliente(cliente.id)}
                      className="text-sm font-bold text-slate-400 hover:text-red-600 border-l pl-4 border-slate-200 transition-colors"
                      title="Borrar cliente"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 EL MODAL REDISEÑADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nombre o Empresa *</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="Ej: Reformas Paco S.L."
                />
              </div>
              
              {/* 🔥 Adaptamos a 1 columna en móvil y 2 en escritorio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">CIF / NIF</label>
                  <input 
                    type="text" value={cif} onChange={(e) => setCif(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="B12345678"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Teléfono</label>
                  <input 
                    type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="600 000 000"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="contacto@empresa.com"
                />
              </div>
              
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all">
                  {editingId ? "Actualizar Cliente" : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}