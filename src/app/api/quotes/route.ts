import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Iniciamos la conexión con la base de datos
const prisma = new PrismaClient();

// 🟢 OBTENER TODOS LOS PRESUPUESTOS (Para llenar la tabla y el PDF)
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        client: true, // Traemos los datos del cliente para la tabla
        items: true,  // Traemos las líneas de concepto para el PDF
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("❌ Error en GET /api/quotes:", error);
    return NextResponse.json({ error: "Error al obtener los presupuestos" }, { status: 500 });
  }
}

// 🔵 CREAR UN NUEVO PRESUPUESTO
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newQuote = await prisma.quote.create({
      data: {
        name: body.name,
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
    return NextResponse.json(newQuote);
  } catch (error) {
    console.error("❌ Error en POST /api/quotes:", error);
    return NextResponse.json({ error: "Error al crear el presupuesto" }, { status: 500 });
  }
}

// 🟠 ACTUALIZAR ESTADO DEL PRESUPUESTO (Aceptar/Rechazar)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updatedQuote = await prisma.quote.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("❌ Error en PATCH /api/quotes:", error);
    return NextResponse.json({ error: "Error al actualizar el estado" }, { status: 500 });
  }
}

// 🔴 BORRAR UN PRESUPUESTO
export async function DELETE(request: Request) {
  try {
    // Para el DELETE usamos los parámetros de la URL (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del presupuesto" }, { status: 400 });
    }

    await prisma.quote.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en DELETE /api/quotes:", error);
    return NextResponse.json({ error: "Error al borrar el presupuesto" }, { status: 500 });
  }
}