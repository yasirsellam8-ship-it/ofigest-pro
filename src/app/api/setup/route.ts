import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Encriptamos la contraseña "123456"
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Creamos tu usuario administrador ligado a tu empresa actual
    const newUser = await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@ofigest.com",
        password: hashedPassword,
        companyId: "mi-empresa-123" // La misma empresa que usamos para facturas y clientes
      }
    });

    return NextResponse.json({ mensaje: "✅ Usuario Admin creado con éxito", usuario: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: "El usuario ya existe o hubo un error", detalle: error.message });
  }
}