"use client";

import { useState, useEffect } from "react";
import { PresupuestoPDF } from "@/components/PresupuestoPDF";

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presupuestoActivoParaPDF, setPresupuestoActivoParaPDF] = useState<any>(null);

  // 🔥 EL MOTOR DE IMPRESIÓN (AHORA CAMBIA EL NOMBRE DEL PDF)
  useEffect(() => {
    if (presupuestoActivoParaPDF) {
      // Guardamos el título original y lo cambiamos por el nombre del proyecto
      const tituloOriginal = document.title;
      const nombreLimpio = presupuestoActivoParaPDF.name.replace(/\s+/g, '_');
      document.title = `Presupuesto_${nombreLimpio}`;

      setTimeout(() => {
        window.print();
        // Restauramos el título original de la web al terminar
        document.title = tituloOriginal;
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

  const borrarPresupuesto = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este presupuesto? Esta acción no se puede deshacer.")) return;

    const res = await fetch(`/api/quotes?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      cargarPresupuestos();
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
      <div className="print:hidden min-h-[85vh] bg-slate-50 p-6 md:p-8 rounded-2xl">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Presupuestos</h2>
          <button onClick={abrirNuevoPresupuesto} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md">
            + Nuevo Presupuesto
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Título del Proyecto</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {presupuestos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-blue-50 p-5 rounded-full shadow-inner mb-2">
                        <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Aún no tienes presupuestos</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                          Crea tu primer presupuesto haciendo clic en el botón superior para empezar a enviarlo a tus clientes.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                presupuestos.map((presu: any, i: number) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-slate-800">{presu.name}</td>
                    <td className="p-4 text-slate-600">{presu.client?.name || "Desconocido"}</td>
                    <td className="p-4 text-right font-bold text-slate-800">{(presu.total || 0).toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border ${
                        presu.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-200' : 
                        presu.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {presu.status === 'PENDING' ? 'Pendiente' : presu.status === 'ACCEPTED' ? 'Aceptado' : 'Rechazado'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      {presu.status === 'PENDING' ? (
                        <>
                          <button onClick={() => cambiarEstado(presu.id, 'ACCEPTED')} className="text-sm font-bold text-green-600 hover:text-green-800 transition-colors">Aceptar</button>
                          <button onClick={() => cambiarEstado(presu.id, 'REJECTED')} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors">Rechazar</button>
                        </>
                      ) : (
                        <button onClick={() => cambiarEstado(presu.id, 'PENDING')} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Restablecer</button>
                      )}
                      
                      <button onClick={() => generarPDF(presu)} className="text-sm font-bold text-blue-600 hover:text-blue-800 border-l pl-4 border-slate-200 transition-colors">
                        📄 PDF
                      </button>

                      <button onClick={() => borrarPresupuesto(presu.id)} className="text-sm font-bold text-slate-400 hover:text-red-600 border-l pl-4 border-slate-200 transition-colors" title="Borrar presupuesto">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-800">Crear Presupuesto</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Título del proyecto *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="Ej: Reforma cocina" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Cliente *</label>
                    <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                      <option value="">-- Selecciona un cliente --</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Líneas de concepto</h4>
                    <button type="button" onClick={agregarLinea} className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors">+ Añadir línea</button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input type="text" placeholder="Concepto del trabajo" required value={item.concept} onChange={(e) => actualizarLinea(index, 'concept', e.target.value)} className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 outline-none" />
                        <input type="number" min="0.1" step="0.1" required value={item.quantity} onChange={(e) => actualizarLinea(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 outline-none" title="Cantidad" />
                        <input type="number" min="0" step="0.01" required value={item.price} onChange={(e) => actualizarLinea(index, 'price', parseFloat(e.target.value) || 0)} className="w-32 rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 outline-none" title="Precio Ud." />
                        <select value={item.taxRate} onChange={(e) => actualizarLinea(index, 'taxRate', parseFloat(e.target.value))} className="w-24 rounded-lg border border-slate-300 p-2 text-sm bg-white focus:border-blue-500 outline-none">
                          <option value="21">21% IVA</option><option value="10">10% IVA</option><option value="0">0% IVA</option>
                        </select>
                        {items.length > 1 && <button type="button" onClick={() => quitarLinea(index)} className="text-red-400 hover:text-red-600 font-bold px-2 transition-colors">✕</button>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-6">
                  <div className="w-72 space-y-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-slate-600"><span>Base Imponible:</span><span className="font-medium">{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-slate-600"><span>Impuestos (IVA):</span><span className="font-medium">{taxAmount.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-lg font-black text-slate-800 border-t border-slate-200 pt-3 mt-1"><span>TOTAL:</span><span>{total.toFixed(2)} €</span></div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
                  <button type="submit" className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all">Guardar Presupuesto</button>
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