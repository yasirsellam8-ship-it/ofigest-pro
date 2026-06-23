/**
 * src/domain/shared/interfaces/IRepository.ts
 *
 * Contrato base que deben implementar todos los repositorios.
 * Seguimos el patrón Repository del DDD: el dominio define la interfaz,
 * la infraestructura provee la implementación concreta.
 */

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface IRepository<T, ID = string> {
  findById(id: ID, companyId: string): Promise<T | null>;
  findAll(
    companyId: string,
    options?: PaginationOptions & { sort?: SortOptions }
  ): Promise<PaginatedResult<T>>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, companyId: string, data: Partial<T>): Promise<T>;
  softDelete(id: ID, companyId: string): Promise<void>;
  restore(id: ID, companyId: string): Promise<T>;
}
