/**
 * src/lib/constants/status.ts
 * Labels, colores y variantes para estados de entidades.
 */

import {
  type QuoteStatus,
  type JobStatus,
  type InvoiceStatus,
  type LeadStatus,
} from "@/lib/types";

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
  EXPIRED: "Expirado",
};

export const QUOTE_STATUS_COLORS: Record<QuoteStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-amber-100 text-amber-700",
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  PENDING: "Pendiente",
  ASSIGNED: "Asignado",
  EN_ROUTE: "En ruta",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Finalizado",
  CANCELLED: "Cancelado",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  EN_ROUTE: "bg-purple-100 text-purple-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  CANCELLED: "Cancelada",
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo lead",
  CONTACTED: "Contactado",
  QUOTE_SENT: "Presupuesto enviado",
  NEGOTIATION: "Negociación",
  WON: "Ganado",
  LOST: "Perdido",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-purple-100 text-purple-700",
  QUOTE_SENT: "bg-amber-100 text-amber-700",
  NEGOTIATION: "bg-orange-100 text-orange-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};
