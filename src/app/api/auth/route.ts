import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === "admin" && password === "admin123") {
      // Usamos el sistema nativo de cookies de Next.js
      const cookieStore = await cookies();
      
      cookieStore.set("ofigest_auth", "true", { 
        path: "/", // Válida en toda la web
        maxAge: 60 * 60 * 24, // 24 horas
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" // Evita que navegadores estrictos la bloqueen
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}