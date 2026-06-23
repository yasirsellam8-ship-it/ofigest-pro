/**
 * src/config/env.ts
 *
 * Variables de entorno tipadas y validadas con Zod.
 * Se ejecuta en build-time y runtime servidor.
 * Las variables NEXT_PUBLIC_* son accesibles en el cliente.
 *
 * IMPORTANTE: Nunca exportar variables privadas desde aquí
 * hacia componentes cliente.
 */

import { z } from "zod";

// ─── Schema del servidor ───────────────────────────────────────────────────────

const serverSchema = z.object({
  // Entorno
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Base de datos
  DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL válida"),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().default("noreply@ofigest.app"),

  // Storage (MinIO / S3)
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().default("ofigest"),

  // AI (Fase 12)
  OPENAI_API_KEY: z.string().optional(),

  // Maps (Fase 11)
  GOOGLE_MAPS_API_KEY: z.string().optional(),
});

// ─── Schema del cliente ────────────────────────────────────────────────────────

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("OfiGest"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("0.1.0"),
});

// ─── Validación ────────────────────────────────────────────────────────────────

const _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success && process.env.NODE_ENV !== "test") {
  console.error(
    "❌ Variables de entorno del servidor inválidas:",
    _serverEnv.error.flatten().fieldErrors
  );
  // En producción lanzamos error; en dev mostramos warning
  if (process.env.NODE_ENV === "production") {
    throw new Error("Variables de entorno del servidor inválidas");
  }
}

const _clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
});

// ─── Exports tipados ───────────────────────────────────────────────────────────

export const env = {
  ...((_serverEnv.success ? _serverEnv.data : {}) as z.infer<typeof serverSchema>),
  ...((_clientEnv.success ? _clientEnv.data : {}) as z.infer<typeof clientSchema>),
};

// Tipos exportados para uso en el proyecto
export type Env = typeof env;
