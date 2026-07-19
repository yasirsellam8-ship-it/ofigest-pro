import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Comprobamos si existe nuestra cookie de acceso
  const isLoggedIn = request.cookies.has('ofigest_auth');

  // Como el matcher de abajo ya filtra, aquí dentro SOLO entramos si el usuario va a /dashboard
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// LA CLAVE: Solo vigilamos el dashboard y sus subrutas. 
// Al dejar fuera el '/' y el '/login', el middleware jamás podrá crear un bucle de redirección.
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};