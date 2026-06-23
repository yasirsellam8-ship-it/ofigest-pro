export const PresupuestoPDF = ({ presupuesto }: { presupuesto: any }) => {
  if (!presupuesto) return null;

  return (
    // Oculto en pantalla normal, visible al imprimir (print:block)
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] text-sm m-0 p-8">
      
      {/* Cabecera */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter">OfiGest PRO</h1>
          <p className="text-slate-500 mt-1">Instalaciones y Reformas</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest mb-2">Presupuesto</h2>
          <p><span className="font-semibold">Proyecto:</span> {presupuesto.name}</p>
          <p><span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="mb-10 bg-slate-50 p-6 rounded-lg">
        <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Preparado para:</h3>
        <p className="text-lg font-medium">{presupuesto.clientName || "Cliente Genérico"}</p>
        <p className="text-slate-600">CIF/NIF: {presupuesto.clientCif || "—"}</p>
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
          {presupuesto.items?.map((item: any, i: number) => (
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
            <span>{presupuesto.subtotal?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>IVA:</span>
            <span>{presupuesto.taxAmount?.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xl font-black text-slate-800 border-t-2 border-slate-800 pt-3 mt-3">
            <span>TOTAL:</span>
            <span>{presupuesto.total?.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-500 mb-1">Validez del presupuesto: 30 días.</p>
        <p>Este documento es un presupuesto estimativo y no tiene validez legal como factura.</p>
      </div>
    </div>
  );
};