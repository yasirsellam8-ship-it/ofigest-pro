/**
 * src/domain/shared/interfaces/IUseCase.ts
 *
 * Contrato base para todos los Use Cases del sistema.
 * Cada caso de uso tiene exactamente UN método execute().
 * Single Responsibility Principle: un caso de uso = una acción de negocio.
 */

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

/**
 * Contexto de tenant/usuario inyectado en cada request.
 * Se extrae del JWT en el middleware y se pasa a los use cases.
 */
export interface TenantContext {
  companyId: string;
  userId: string;
  role: string;
  permissions: string[];
}
