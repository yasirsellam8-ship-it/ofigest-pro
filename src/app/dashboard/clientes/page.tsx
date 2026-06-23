"use client";

import { useState, useEffect } from "react";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Guardamos el ID si estamos editando a alguien. Si es null, es un cliente nuevo.
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

  // Función al pulsar "+ Nuevo Cliente" (Limpia todo)
  const abrirNuevoCliente = () => {
    setEditingId(null);
    setName(""); setCif(""); setPhone(""); setEmail("");
    setIsModalOpen(true);
  };

  // Función al pulsar "Editar" en la tabla (Rellena los datos)
  const abrirEditarCliente = (cliente: any) => {
    setEditingId(cliente.id);
    setName(cliente.name);
    setCif(cliente.cif || "");
    setPhone(cliente.phone || "");
    setEmail(cliente.email || "");
    setIsModalOpen(true);
  };

  // Función para guardar (Sirve para Crear y para Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const metodo = editingId ? "PUT" : "POST";
    const datosEnvio = editingId 
      ? { id: editingId, name, cif, phone, email } // Si editamos, enviamos el ID
      : { name, cif, phone, email };               // Si creamos, no hay ID aún

    const res = await fetch("/api/customers", {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEnvio),
    });

    if (res.ok) {
      setIsModalOpen(false);
      cargarClientes(); 
      alert(editingId ? "✏️ Cliente actualizado" : "✅ Cliente guardado");
    } else {
      alert("❌ Hubo un problema al guardar.");
    }
  };

  // Función para BORRAR
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Mis Clientes</h2>
        <button 
          onClick={abrirNuevoCliente}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-800">
            <tr>
              <th className="p-4 font-semibold">Nombre del Cliente</th>
              <th className="p-4 font-semibold">CIF / NIF</th>
              <th className="p-4 font-semibold">Teléfono</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Todavía no tienes ningún cliente guardado. Haz clic en "Nuevo Cliente" para empezar.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="transition hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{cliente.name}</td>
                  <td className="p-4">{cliente.cif || "—"}</td>
                  <td className="p-4">{cliente.phone || "—"}</td>
                  <td className="p-4 text-right space-x-3">
                    {/* BOTÓN EDITAR */}
                    <button 
                      onClick={() => abrirEditarCliente(cliente)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    {/* BOTÓN BORRAR */}
                    <button 
                      onClick={() => borrarCliente(cliente.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Editar Cliente" : "Añadir Nuevo Cliente"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nombre o Empresa *</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">CIF / NIF</label>
                  <input 
                    type="text" value={cif} onChange={(e) => setCif(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                  <input 
                    type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-blue-500" 
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Cancelar
                </button>
                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
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