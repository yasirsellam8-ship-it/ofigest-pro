export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Iniciamos la conexión con la base de datos
const prisma = new PrismaClient();

// 🟢 GET: OBTENER TODAS LAS FACTURAS
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true, // Traemos los datos del cliente
        items: true,  // Traemos las líneas de concepto para el PDF
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("❌ Error en GET /api/invoices:", error);
    return NextResponse.json({ error: "Error al obtener las facturas" }, { status: 500 });
  }
}

// 🔵 POST: CREAR UNA NUEVA FACTURA
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newInvoice = await prisma.invoice.create({
      data: {
        number: body.number,
        clientId: body.clientId,
        subtotal: body.subtotal,
        taxAmount: body.taxAmount,
        total: body.total,
        // Magia de Prisma: Creamos las líneas vinculadas en la misma operación
        items: {
          create: body.items.map((item: any) => ({
            concept: item.concept,
            quantity: item.quantity,
            price: item.price,
            taxRate: item.taxRate,
          })),
        },
      },
    });
    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("❌ Error en POST /api/invoices:", error);
    return NextResponse.json({ error: "Error al crear la factura" }, { status: 500 });
  }
}

// 🟠 PATCH: ACTUALIZAR ESTADO DE LA FACTURA (Pagada / Pendiente)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updatedInvoice = await prisma.invoice.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("❌ Error en PATCH /api/invoices:", error);
    return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 });
  }
}

// 🔴 DELETE: BORRAR UNA FACTURA
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID de la factura" }, { status: 400 });
    }

    await prisma.invoice.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en DELETE /api/invoices:", error);
    return NextResponse.json({ error: "Error al borrar la factura" }, { status: 500 });
  }
}