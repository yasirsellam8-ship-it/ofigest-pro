"use client";

import { useState, useEffect } from "react";
import { PresupuestoPDF } from "@/components/PresupuestoPDF";

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestoActivoParaPDF, setPresupuestoActivoParaPDF] = useState<any>(null);

  // EL MOTOR DE IMPRESIÓN
  useEffect(() => {
    if (presupuestoActivoParaPDF) {
      setTimeout(() => {
        window.print();
        setPresupuestoActivoParaPDF(null);
      }, 100);
    }
  }, [presupuestoActivoParaPDF]);

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<any[]>([{ concept: "", quantity: 1, price: 0, taxRate: 21 }]);

  useEffect(() => {
    cargarClientes();
    cargarPresupuestos();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setClientes(await res.json());
    } catch (error) {}
  };

  const cargarPresupuestos = async () => {
    try {
      const res = await fetch("/api/quotes");
      if (res.ok) setPresupuestos(await res.json());
    } catch (error) {}
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    const res = await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nuevoEstado }),
    });
    if (res.ok) cargarPresupuestos();
  };

  // NUEVA FUNCIÓN PARA BORRAR PRESUPUESTO
  const borrarPresupuesto = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este presupuesto? Esta acción no se puede deshacer.")) return;

    const res = await fetch(`/api/quotes?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      cargarPresupuestos(); // Recarga la tabla al momento
    } else {
      alert("Error al borrar el presupuesto");
    }
  };

  const agregarLinea = () => setItems([...items, { concept: "", quantity: 1, price: 0, taxRate: 21 }]);
  const quitarLinea = (index: number) => setItems(items.filter((_, i) => i !== index));
  const actualizarLinea = (index: number, campo: string, valor: any) => {
    const nuevas = [...items];
    nuevas[index] = { ...nuevas[index], [campo]: valor };
    setItems(nuevas);
  };

  const calcularTotales = () => {
    let subtotal = 0, taxAmount = 0;
    items.forEach(item => {
      const base = item.quantity * item.price;
      subtotal += base;
      taxAmount += base * (item.taxRate / 100);
    });
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const { subtotal, taxAmount, total } = calcularTotales();

  const abrirNuevoPresupuesto = () => {
    setName(""); setClientId(""); setItems([{ concept: "", quantity: 1, price: 0, taxRate: 21 }]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return alert("Debes seleccionar un cliente");
    
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clientId, items, subtotal, taxAmount, total }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      cargarPresupuestos();
    }
  };

  const generarPDF = (presu: any) => {
    setPresupuestoActivoParaPDF({
      ...presu,
      clientName: presu.client?.name,
      clientCif: presu.client?.cif,
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Presupuestos</h2>
          <button onClick={abrirNuevoPresupuesto} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            + Nuevo Presupuesto
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800">
              <tr>
                <th className="p-4 font-semibold">Título</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {presupuestos.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No hay presupuestos creados.</td></tr>
              ) : (
                presupuestos.map((presu, i) => (
                  <tr key={i} className="transition hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{presu.name}</td>
                    <td className="p-4">{presu.client?.name || "Desconocido"}</td>
                    <td className="p-4 text-right font-semibold text-slate-700">{(presu.total || 0).toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        presu.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 
                        presu.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {presu.status === 'PENDING' ? 'Pendiente' : presu.status === 'ACCEPTED' ? 'Aceptado' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      {presu.status === 'PENDING' ? (
                        <>
                          <button onClick={() => cambiarEstado(presu.id, 'ACCEPTED')} className="text-xs text-green-600 hover:underline">Aceptar</button>
                          <button onClick={() => cambiarEstado(presu.id, 'REJECTED')} className="text-xs text-red-600 hover:underline">Rechazar</button>
                        </>
                      ) : (
                        <button onClick={() => cambiarEstado(presu.id, 'PENDING')} className="text-xs text-slate-400 hover:underline">Restablecer</button>
                      )}
                      
                      <button onClick={() => generarPDF(presu)} className="text-sm font-medium text-blue-600 hover:text-blue-800 border-l pl-3 border-slate-200">
                        📄 PDF
                      </button>

                      {/* BOTÓN DE BORRAR */}
                      <button onClick={() => borrarPresupuesto(presu.id)} className="text-sm font-medium text-red-500 hover:text-red-700 border-l pl-3 border-slate-200" title="Borrar presupuesto">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold text-slate-800">Crear Presupuesto</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 text-xl font-bold">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Título de la obra / proyecto *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border p-2 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Cliente *</label>
                    <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-md border p-2 text-sm bg-white">
                      <option value="">-- Selecciona un cliente --</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Líneas de concepto</h4>
                    <button type="button" onClick={agregarLinea} className="text-sm text-blue-600 font-semibold">+ Añadir línea</button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <input type="text" placeholder="Concepto" required value={item.concept} onChange={(e) => actualizarLinea(index, 'concept', e.target.value)} className="flex-1 rounded border p-2 text-sm" />
                        <input type="number" min="0.1" step="0.1" required value={item.quantity} onChange={(e) => actualizarLinea(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded border p-2 text-sm" />
                        <input type="number" min="0" step="0.01" required value={item.price} onChange={(e) => actualizarLinea(index, 'price', parseFloat(e.target.value) || 0)} className="w-32 rounded border p-2 text-sm" />
                        <select value={item.taxRate} onChange={(e) => actualizarLinea(index, 'taxRate', parseFloat(e.target.value))} className="w-24 rounded border p-2 text-sm bg-white">
                          <option value="21">21% IVA</option><option value="10">10% IVA</option><option value="0">0% IVA</option>
                        </select>
                        {items.length > 1 && <button type="button" onClick={() => quitarLinea(index)} className="text-red-500 font-bold px-2">✕</button>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end border-t pt-4">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600"><span>Base Imponible:</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-slate-600"><span>Impuestos (IVA):</span><span>{taxAmount.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>TOTAL:</span><span>{total.toFixed(2)} €</span></div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600">Cancelar</button>
                  <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">Guardar Presupuesto</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <PresupuestoPDF presupuesto={presupuestoActivoParaPDF} />
    </>
  );
}