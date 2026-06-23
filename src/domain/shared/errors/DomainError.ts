/**
 * src/domain/shared/errors/DomainError.ts
 *
 * Jerarquía de errores de dominio.
 * Los errores de dominio son errores esperados, no excepciones de sistema.
 * Cada uno mapea a un código HTTP específico en las API Routes.
 */

export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Necesario para instanceof correcto en TypeScript con ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

// 404
export class NotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";

  constructor(entity: string, id?: string) {
    super(id ? `${entity} con id '${id}' no encontrado` : `${entity} no encontrado`);
  }
}

// 401
export class UnauthorizedError extends DomainError {
  readonly statusCode = 401;
  readonly code = "UNAUTHORIZED";

  constructor(message = "No autenticado") {
    super(message);
  }
}

// 403
export class ForbiddenError extends DomainError {
  readonly statusCode = 403;
  readonly code = "FORBIDDEN";

  constructor(message = "No tienes permisos para esta acción") {
    super(message);
  }
}

// 422
export class ValidationError extends DomainError {
  readonly statusCode = 422;
  readonly code = "VALIDATION_ERROR";
  readonly details: Record<string, string[]>;

  constructor(message: string, details: Record<string, string[]> = {}) {
    super(message);
    this.details = details;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      details: this.details,
    };
  }
}

// 409
export class ConflictError extends DomainError {
  readonly statusCode = 409;
  readonly code = "CONFLICT";

  constructor(message: string) {
    super(message);
  }
}

// 400
export class BadRequestError extends DomainError {
  readonly statusCode = 400;
  readonly code = "BAD_REQUEST";

  constructor(message: string) {
    super(message);
  }
}

// 429
export class TooManyRequestsError extends DomainError {
  readonly statusCode = 429;
  readonly code = "TOO_MANY_REQUESTS";

  constructor(message = "Demasiadas solicitudes. Inténtalo más tarde") {
    super(message);
  }
}

// ─── Helper: identificar errores de dominio ────────────────────────────────────

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
