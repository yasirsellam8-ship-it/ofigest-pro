/**
 * src/application/shared/ResponseWrapper.ts
 *
 * Wrapper estándar para todas las respuestas de la API.
 * Asegura consistencia en la forma de los datos devueltos.
 */

import { NextResponse } from "next/server";
import { isDomainError } from "@/domain/shared/errors/DomainError";

// ─── Tipos de respuesta ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Helpers de respuesta ──────────────────────────────────────────────────────

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: PaginationMeta
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    { success: true, data, ...(meta ? { meta } : {}) },
    { status }
  );
}

export function errorResponse(
  error: unknown,
  fallbackStatus = 500
): NextResponse<ApiError> {
  // Error de dominio conocido
  if (isDomainError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: "details" in error ? error.details : undefined,
        },
      },
      { status: error.statusCode }
    );
  }

  // Error de Zod (validación de input)
  if (error instanceof Error && error.name === "ZodError") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Datos de entrada inválidos",
          details: JSON.parse(error.message),
        },
      },
      { status: 422 }
    );
  }

  // Error inesperado
  console.error("[API Error]", error);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Error interno del servidor",
      },
    },
    { status: fallbackStatus }
  );
}
