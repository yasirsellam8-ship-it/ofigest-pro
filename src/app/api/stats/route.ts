import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Contar el total de clientes registrados
    const totalClientes = await prisma.client.count();

    // 2. Contar los presupuestos que están en estado PENDING
    const presupuestosPendientes = await prisma.quote.count({
      where: {
        status: "PENDING",
      },
    });

    // 3. Sumar el importe total de todas las facturas emitidas
    const agregacionFacturas = await prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
    });

    // Si no hay facturas, la suma devuelve null, por lo que aseguramos un 0
    const facturacionTotal = agregacionFacturas._sum.total || 0;

    return NextResponse.json({
      totalClientes,
      presupuestosPendientes,
      facturacionTotal,
    });
  } catch (error) {
    console.error("❌ Error al calcular estadísticas:", error);
    return NextResponse.json({ error: "Error al cargar estadísticas" }, { status: 500 });
  }
}