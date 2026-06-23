import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase';
import { PrismaUserRepository } from '../../../../infrastructure/repositories/PrismaUserRepository';
import { Argon2HashService } from '../../../../infrastructure/services/Argon2HashService';

const userRepository = new PrismaUserRepository();
const hashService = new Argon2HashService();
const loginUseCase = new LoginUseCase(userRepository, hashService);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'El email y la contraseña son obligatorios' },
        { status: 400 }
      );
    }

    const user = await loginUseCase.execute(email, password);

    // 1. Creamos el token JWT con los datos básicos del usuario
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET || 'secret_fallback',
      { expiresIn: '7d' } // El token expira en 7 días
    );

    // 2. Preparamos la respuesta de éxito
    const response = NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: user
    }, { status: 200 });

    // 3. Inyectamos la cookie de sesión en el navegador
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Seguridad máxima: impide que scripts maliciosos roben el token
      secure: process.env.NODE_ENV === 'production', // Solo viaja por HTTPS en producción
      sameSite: 'lax', // Protege contra ataques de suplantación (CSRF)
      maxAge: 60 * 60 * 24 * 7, // Duración de la cookie: 7 días en segundos
      path: '/', // Válida para toda la plataforma
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al iniciar sesión' },
      { status: 401 }
    );
  }
}