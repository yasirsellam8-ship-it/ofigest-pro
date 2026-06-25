"use client";

import { useState, useEffect } from "react";
import { FacturaPDF } from "@/components/FacturaPDF";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facturaActivaParaPDF, setFacturaActivaParaPDF] = useState<any>(null);

  // EL MOTOR DE IMPRESIÓN
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

  const borrarFactura = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres borrar esta factura? Esta acción no se puede deshacer.")) return;

    const res = await fetch(`/api/invoices?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      cargarFacturas();
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
      <div className="print:hidden min-h-[85vh] bg-slate-50 p-6 md:p-8 rounded-2xl">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Facturas</h2>
          <button onClick={abrirNuevaFactura} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all hover:shadow-md">
            + Nueva Factura
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Nº Factura</th>
                <th className="p-4">Cliente</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facturas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="bg-emerald-50 p-5 rounded-full shadow-inner mb-2">
                        <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Aún no has emitido facturas</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                          Crea tu primera factura haciendo clic en el botón superior para empezar a registrar tus cobros.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                facturas.map((fac, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-slate-800">{fac.number}</td>
                    <td className="p-4 text-slate-600">{fac.client?.name || "Desconocido"}</td>
                    <td className="p-4 text-right font-bold text-slate-800">{(fac.total || 0).toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border ${
                        fac.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {fac.status === 'PAID' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      {fac.status === 'UNPAID' ? (
                        <button onClick={() => cambiarEstadoFactura(fac.id, 'PAID')} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                          Cobrar
                        </button>
                      ) : (
                        <button onClick={() => cambiarEstadoFactura(fac.id, 'UNPAID')} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                          Anular pago
                        </button>
                      )}
                      
                      <button onClick={() => generarPDF(fac)} className="text-sm font-bold text-blue-600 hover:text-blue-800 border-l pl-4 border-slate-200 transition-colors">
                        📄 PDF
                      </button>

                      <button onClick={() => borrarFactura(fac.id)} className="text-sm font-bold text-slate-400 hover:text-red-600 border-l pl-4 border-slate-200 transition-colors" title="Borrar factura">
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
                <h3 className="text-xl font-bold text-slate-800">Emitir Nueva Factura</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nº Factura *</label>
                    <input type="text" required value={number} onChange={(e) => setNumber(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Cliente *</label>
                    <select required value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all">
                      <option value="">-- Selecciona --</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Líneas de concepto</h4>
                    <button type="button" onClick={agregarLinea} className="text-sm text-emerald-600 font-bold hover:text-emerald-800 transition-colors">+ Añadir concepto</button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <input type="text" placeholder="Concepto" required value={item.concept} onChange={(e) => actualizarLinea(index, 'concept', e.target.value)} className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:border-emerald-500 outline-none" />
                        <input type="number" min="0.1" step="0.1" required value={item.quantity} onChange={(e) => actualizarLinea(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-24 rounded-lg border border-slate-300 p-2 text-sm focus:border-emerald-500 outline-none" title="Cantidad" />
                        <input type="number" min="0" step="0.01" required value={item.price} onChange={(e) => actualizarLinea(index, 'price', parseFloat(e.target.value) || 0)} className="w-32 rounded-lg border border-slate-300 p-2 text-sm focus:border-emerald-500 outline-none" title="Precio Ud." />
                        <select value={item.taxRate} onChange={(e) => actualizarLinea(index, 'taxRate', parseFloat(e.target.value))} className="w-24 rounded-lg border border-slate-300 p-2 text-sm bg-white focus:border-emerald-500 outline-none">
                          <option value="21">21% IVA</option><option value="10">10% IVA</option><option value="0">0% Exento</option>
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
                  <button type="submit" className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md transition-all">Emitir Factura</button>
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