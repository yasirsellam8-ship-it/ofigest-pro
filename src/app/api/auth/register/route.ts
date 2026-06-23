import { NextResponse } from 'next/server';
import { RegisterCompanyUseCase } from '../../../../application/use-cases/auth/RegisterCompanyUseCase';
import { PrismaCompanyRepository } from '../../../../infrastructure/repositories/PrismaCompanyRepository';
import { PrismaUserRepository } from '../../../../infrastructure/repositories/PrismaUserRepository';
import { Argon2HashService } from '../../../../infrastructure/services/Argon2HashService';

// Inyección de dependencias manual para el manejador de la ruta
const companyRepository = new PrismaCompanyRepository();
const userRepository = new PrismaUserRepository();
const hashService = new Argon2HashService();
const registerCompanyUseCase = new RegisterCompanyUseCase(
  companyRepository,
  userRepository,
  hashService
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, taxId, companyEmail, ownerName, ownerEmail, password } = body;

    // Validación básica de entrada
    if (!companyName || !taxId || !companyEmail || !ownerName || !ownerEmail || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    const result = await registerCompanyUseCase.execute({
      companyName,
      taxId,
      companyEmail,
      ownerName,
      ownerEmail,
      password,
    });

    return NextResponse.json(
      { 
        message: 'Empresa y administrador registrados correctamente', 
        companyId: result.companyId 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error en registro:', error);
    
    // Captura de errores específicos del dominio
    if (error.name === 'EmailAlreadyExistsError' || error.name === 'TaxIdAlreadyExistsError') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error.name === 'InvalidEmailError' || error.name === 'InvalidPasswordError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Error interno del servidor durante el registro' },
      { status: 500 }
    );
  }
}