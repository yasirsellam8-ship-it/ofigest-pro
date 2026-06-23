/**
 * src/lib/types/index.ts
 * Tipos globales compartidos en todo el proyecto.
 */

// ─── Roles y permisos ──────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "OFICINA" | "TECNICO";

export type Permission =
  | "customers:read"
  | "customers:write"
  | "customers:delete"
  | "leads:read"
  | "leads:write"
  | "leads:delete"
  | "quotes:read"
  | "quotes:write"
  | "quotes:delete"
  | "jobs:read"
  | "jobs:write"
  | "jobs:delete"
  | "invoices:read"
  | "invoices:write"
  | "invoices:delete"
  | "settings:read"
  | "settings:write"
  | "users:read"
  | "users:write"
  | "users:delete"
  | "reports:read";

// ─── Estados de entidades ──────────────────────────────────────────────────────

export type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export type JobStatus =
  | "PENDING"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUOTE_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

// ─── Tipos de actividad ────────────────────────────────────────────────────────

export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED"
  | "ASSIGNED"
  | "LOGIN"
  | "LOGOUT";

// ─── Tipos de notificación ─────────────────────────────────────────────────────

export type NotificationType =
  | "JOB_ASSIGNED"
  | "JOB_UPDATED"
  | "QUOTE_ACCEPTED"
  | "QUOTE_REJECTED"
  | "INVOICE_PAID"
  | "INVOICE_OVERDUE"
  | "SYSTEM";

// ─── Tipos de archivo ──────────────────────────────────────────────────────────

export type FileType = "IMAGE" | "PDF" | "DOCUMENT" | "SIGNATURE";

// ─── Tipos de empresa ──────────────────────────────────────────────────────────

export type CompanyType =
  | "ELECTRICIDAD"
  | "FONTANERIA"
  | "SOLAR"
  | "CLIMATIZACION"
  | "MANTENIMIENTO"
  | "REFORMAS"
  | "OTRO";

// ─── Helpers de tipo ───────────────────────────────────────────────────────────

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = void> = () => Promise<T>;

// Omit con múltiples keys
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

// Partial recursivo
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ID string branded type para mayor seguridad de tipos
export type BrandedId<Brand extends string> = string & { __brand: Brand };
export type UserId = BrandedId<"UserId">;
export type CompanyId = BrandedId<"CompanyId">;
export type CustomerId = BrandedId<"CustomerId">;
