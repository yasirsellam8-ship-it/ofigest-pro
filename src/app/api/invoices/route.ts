import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true }, 
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar facturas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, clientId, items, subtotal, taxAmount, total } = body;

    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: { name: "Mi Empresa Instaladora", taxId: "B12345678", email: "info@miempresa.com" }
      });
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        number,
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

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar la factura" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body; 

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    return NextResponse.json({ error: "Error al cambiar el estado" }, { status: 500 });
  }
}

// NUEVO: Método DELETE para borrar la factura
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
    }

    // Borramos los conceptos de la factura primero (por seguridad)
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    });

    // Borramos la factura
    await prisma.invoice.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Factura borrada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al borrar la factura" }, { status: 500 });
  }
}