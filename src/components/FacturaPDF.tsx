import { forwardRef } from "react";

// Este componente es el "folio A4" invisible que se convertirá en PDF
export const FacturaPDF = forwardRef<HTMLDivElement, { factura: any }>(({ factura }, ref) => {
  if (!factura) return null;

  return (
    <div className="hidden">
      {/* Todo lo que esté dentro de este div es lo que se imprime */}
      <div ref={ref} className="p-12 bg-white text-slate-800 w-[210mm] min-h-[297mm] mx-auto text-sm">
        
        {/* Cabecera: Tu Empresa y Datos de Factura */}
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black text-blue-600 tracking-tighter">OfiGest PRO</h1>
            <p className="text-slate-500 mt-1">Instalaciones y Reformas</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest mb-2">Factura</h2>
            <p><span className="font-semibold">Nº:</span> {factura.number}</p>
            <p><span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="mb-10 bg-slate-50 p-6 rounded-lg">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Facturar a:</h3>
          <p className="text-lg font-medium">{factura.clientName || "Cliente Genérico"}</p>
          <p className="text-slate-600">CIF/NIF: {factura.clientCif || "—"}</p>
        </div>

        {/* Tabla de Conceptos */}
        <table className="w-full text-left mb-10">
          <thead>
            <tr className="border-b-2 border-slate-800 text-slate-800">
              <th className="py-3 font-bold">Concepto</th>
              <th className="py-3 font-bold text-center">Cant.</th>
              <th className="py-3 font-bold text-right">Precio</th>
              <th className="py-3 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.items?.map((item: any, i: number) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-4">{item.concept}</td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{item.price.toFixed(2)} €</td>
                <td className="py-4 text-right font-medium">{(item.quantity * item.price).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Base Imponible:</span>
              <span>{factura.subtotal?.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA:</span>
              <span>{factura.taxAmount?.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-800 border-t-2 border-slate-800 pt-3 mt-3">
              <span>TOTAL:</span>
              <span>{factura.total?.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>Gracias por confiar en nuestros servicios.</p>
          <p>Documento generado mediante OfiGest PRO.</p>
        </div>
      </div>
    </div>
  );
});

FacturaPDF.displayName = "FacturaPDF";