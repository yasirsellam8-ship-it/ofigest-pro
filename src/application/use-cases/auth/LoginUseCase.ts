import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { Argon2HashService } from '../../../infrastructure/services/Argon2HashService';

export class LoginUseCase {
  constructor(
    private userRepository: PrismaUserRepository,
    private hashService: Argon2HashService
  ) {}

  async execute(email: string, password: string) {
    // 1. Buscamos al usuario en la base de datos
    const user = await this.userRepository.findByEmail(email);
    
    // Si no existe, lanzamos error
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // 2. Comprobamos la contraseña con Argon2
    const isPasswordValid = await this.hashService.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // 3. Si todo es correcto, devolvemos los datos básicos del usuario
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    };
  }
}