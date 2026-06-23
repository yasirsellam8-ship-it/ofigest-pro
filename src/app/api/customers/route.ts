import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GUARDAR (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cif, phone, email } = body;

    if (!name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });

    const newClient = await prisma.client.create({
      data: {
        name,
        cif: cif || null,
        phone: phone || null,
        email: email || null,
        companyId: 'mi-empresa-123', 
      }
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al crear', detalle: error.message }, { status: 500 });
  }
}

// 2. LEER (GET)
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      where: { companyId: 'mi-empresa-123' },
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(clients, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al leer' }, { status: 500 });
  }
}

// 3. ACTUALIZAR/EDITAR (PUT)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, cif, phone, email } = body;

    const updatedClient = await prisma.client.update({
      where: { id: id },
      data: { name, cif, phone, email }
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// 4. BORRAR (DELETE)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.client.delete({
      where: { id: id }
    });

    return NextResponse.json({ mensaje: 'Cliente borrado correctamente' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al borrar' }, { status: 500 });
  }
}