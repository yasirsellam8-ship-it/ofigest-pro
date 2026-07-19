import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Iniciamos la conexión con la base de datos
const prisma = new PrismaClient();

// 🟢 OBTENER TODOS LOS CLIENTES (Para llenar la tabla)
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" }, // Los más nuevos primero
    });
    return NextResponse.json(customers);
  } catch (error) {
    // Si falla, ahora SÍ lo imprimirá en rojo en tu terminal
    console.error("❌ Error en GET /api/customers:", error);
    return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 });
  }
}

// 🔵 CREAR UN NUEVO CLIENTE (Botón + Nuevo Cliente)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCustomer = await prisma.customer.create({
      data: {
        name: body.name,
        cif: body.cif || null,
        phone: body.phone || null,
        email: body.email || null,
      },
    });
    return NextResponse.json(newCustomer);
  } catch (error) {
    console.error("❌ Error en POST /api/customers:", error);
    return NextResponse.json({ error: "Error al crear el cliente" }, { status: 500 });
  }
}

// 🟠 ACTUALIZAR UN CLIENTE (Botón Editar)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedCustomer = await prisma.customer.update({
      where: { id: body.id },
      data: {
        name: body.name,
        cif: body.cif || null,
        phone: body.phone || null,
        email: body.email || null,
      },
    });
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("❌ Error en PUT /api/customers:", error);
    return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 });
  }
}

// 🔴 BORRAR UN CLIENTE (Botón Borrar)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await prisma.customer.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error en DELETE /api/customers:", error);
    return NextResponse.json({ error: "Error al borrar el cliente" }, { status: 500 });
  }
}