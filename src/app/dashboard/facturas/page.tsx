"use client";

import { useState, useEffect } from "react";
import { FacturaPDF } from "@/components/FacturaPDF";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facturaActivaParaPDF, setFacturaActivaParaPDF] = useState<any>(null);

  useEffect(() => {
    if (facturaActivaParaPDF) {
      setTimeout(() => {
        window.print();
        setFacturaActivaParaPDF(null);
      }, 100);
    }
  }, [facturaActivaParaPDF]);

  const [number, setNumber] = useState("");
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<any[]>([{ concept: "", quantity: 1, price: 0, taxRate: 21 }]);

  useEffect(() => {
    cargarClientes();
    cargarFacturas();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await fetch("/api/customers");
      if (res.ok) setClientes(await res.json());
    } catch (error) {}
  };

  const cargarFacturas = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) setFacturas(await res.json());
    } catch (error) {}
  };

  const cambiarEstadoFactura = async (id: string, nuevoEstado: string) => {
    const res = await fetch("/api/invoices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nuevoEstado }),
    });
    if (res.ok) cargarFacturas();
  };

  // NUEVA FUNCIÓN PARA BORRAR FACTURA
  const borrarFactura = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar esta factura? Esta acción no se puede deshacer.")) return;

    const res = await fetch(`/api/invoices?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      cargarFacturas(); // Recarga la tabla de inmediato
    } else {
      alert("Error al borrar la factura");
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
    items.forEach(i => {
      const base = i.quantity * i.price;
      subtotal += base;
      taxAmount += base * (i.taxRate / 100);
    });
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const { subtotal, taxAmount, total } = calcularTotales();

  const abrirNuevaFactura = () => {
    setNumber(`FAC-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
    setClientId("");
    setItems([{ concept: "", quantity: 1, price: 0, taxRate: 21 }]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return alert("Selecciona un cliente");
    
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number, clientId, items, subtotal, taxAmount, total }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      cargarFacturas();
    }
  };

  const generarPDF = (fac: any) => {
    setFacturaActivaParaPDF({
      ...fac,
      clientName: fac.client?.name,
      clientCif: fac.client?.cif,
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Mis Facturas</h2>
          <button onClick={abrirNuevaFactura} className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
            + Nueva Factura
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800">
              <tr>
                <th className="p-4 font-semibold">Nº Factura</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold text-right">Total</th>
                <th className="p-4 font-semibold text-center">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facturas.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Aún no has emitido ninguna factura.</td></tr>
              ) : (
                facturas.map((fac, i) => (
                  <tr key={i} className="transition hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800">{fac.number}</td>
                    <td className="p-4">{fac.client?.name || "Desconocido"}</td>
                    <td className="p-4 text-right font-semibold text-slate-700">{(fac.total || 0).toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        fac.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fac.status === 'PAID' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      {fac.status === 'UNPAID' ? (
                        <button onClick={() => cambiarEstadoFactura(fac.id, 'PAID')} className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-100 transition">
                          ✓ Marcar Pagada
                        </button>
                      ) : (
                        <button onClick={() => cambiarEstadoFactura(fac.id, 'UNPAID')} className="text-xs text-slate-400 hover:underline">
                          Marcar Pendiente
                        </button>
                      )}
                      
                      <button onClick={() => generarPDF(fac)} className="text-sm font-medium text-blue-600 hover:text-blue-800 border-l pl-3 border-slate-200">
                        📄 PDF
                      </button>

                      {/* NUEVO BOTÓN DE BORRAR */}
                      <button onClick={() => borrarFactura(fac.id)} className="text-sm font-medium text-red-500 hover:text-red-700 border-l pl-3 border-slate-200" title="Borrar factura">
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
                <h3 className="text-xl font-bold text-slate-800">Emitir Nueva Factura</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Nº Factura *</label>
                    <input type="text" required value={number} onChange={(e) => setNumber(e.target.value)} className="w-full rounded-md border p-2 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Cliente *</label>
                    <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-md border p-2 text-sm bg-white">
                      <option value="">-- Selecciona --</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <button type="button" onClick={agregarLinea} className="text-sm text-green-600 font-semibold mb-4">+ Añadir concepto</button>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 bg-slate-50 p-3 rounded-lg border">
                        <input type="text" placeholder="Concepto" required value={item.concept} onChange={(e) => actualizarLinea(index, 'concept', e.target.value)} className="flex-1 rounded border p-2 text-sm" />
                        <input type="number" min="0.1" step="0.1" required value={item.quantity} onChange={(e) => actualizarLinea(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded border p-2 text-sm" />
                        <input type="number" min="0" step="0.01" required value={item.price} onChange={(e) => actualizarLinea(index, 'price', parseFloat(e.target.value) || 0)} className="w-32 rounded border p-2 text-sm" />
                        <select value={item.taxRate} onChange={(e) => actualizarLinea(index, 'taxRate', parseFloat(e.target.value))} className="w-24 rounded border p-2 text-sm bg-white">
                          <option value="21">21% IVA</option><option value="10">10% IVA</option><option value="0">0% Exento</option>
                        </select>
                        {items.length > 1 && <button type="button" onClick={() => quitarLinea(index)} className="text-red-500 font-bold px-2">✕</button>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end border-t pt-4">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Base:</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between"><span>IVA:</span><span>{taxAmount.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>TOTAL:</span><span>{total.toFixed(2)} €</span></div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancelar</button>
                  <button type="submit" className="rounded-md bg-green-600 px-6 py-2 text-sm text-white hover:bg-green-700 shadow-sm">Emitir Factura</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <FacturaPDF factura={facturaActivaParaPDF} />
    </>
  );
}