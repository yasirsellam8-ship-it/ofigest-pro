import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener presupuestos
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true }, 
    });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar presupuestos" }, { status: 500 });
  }
}

// Crear presupuesto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clientId, items, subtotal, taxAmount, total } = body;

    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: { name: "Mi Empresa Instaladora", taxId: "B12345678", email: "info@miempresa.com" }
      });
    }

    const newQuote = await prisma.quote.create({
      data: {
        name,
        clientId,
        companyId: company.id,
        subtotal,
        taxAmount,
        total,
        items: {
          create: items.map((item: any) => ({
            concept: item.concept,
            quantity: item.quantity,
            price: item.price,
            taxRate: item.taxRate
          }))
        }
      }
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar el presupuesto" }, { status: 500 });
  }
}

// Cambiar estado
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body; 

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("Error al actualizar estado del presupuesto:", error);
    return NextResponse.json({ error: "Error al cambiar el estado" }, { status: 500 });
  }
}

// Borrar presupuesto (La papelera)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
    }

    // Por seguridad, primero borramos las líneas de concepto que cuelgan del presupuesto
    await prisma.quoteItem.deleteMany({
      where: { quoteId: id }
    });

    // Y luego borramos el presupuesto en sí
    await prisma.quote.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Presupuesto borrado correctamente" });
  } catch (error) {
    console.error("Error al borrar:", error);
    return NextResponse.json({ error: "Error al borrar el presupuesto" }, { status: 500 });
  }
}