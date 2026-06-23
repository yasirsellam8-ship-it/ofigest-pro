/**
 * src/lib/utils/format.ts
 * Utilidades de formateo para el contexto español.
 */

import { format, formatDistanceToNow, isValid } from "date-fns";
import { es } from "date-fns/locale";

// ─── Fechas ────────────────────────────────────────────────────────────────────

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd/MM/yyyy", { locale: es });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "dd/MM/yyyy HH:mm", { locale: es });
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (!isValid(d)) return "—";
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}

// ─── Moneda ────────────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number | null | undefined,
  currency = "EUR"
): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2).replace(".", ",")} %`;
}

// ─── Documentos de identidad ───────────────────────────────────────────────────

/**
 * Valida NIF/NIE español.
 * NIF: 8 dígitos + letra
 * NIE: X/Y/Z + 7 dígitos + letra
 * CIF: letra + 7 dígitos + letra/dígito
 */
export function validateNIF(nif: string): boolean {
  const cleaned = nif.toUpperCase().trim();

  // NIF
  const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
  if (nifRegex.test(cleaned)) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const num = parseInt(cleaned.slice(0, 8), 10);
    return cleaned[8] === letters[num % 23];
  }

  // NIE
  const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
  if (nieRegex.test(cleaned)) {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const prefix = { X: "0", Y: "1", Z: "2" } as Record<string, string>;
    const num = parseInt(prefix[cleaned[0] as string]! + cleaned.slice(1, 8), 10);
    return cleaned[8] === letters[num % 23];
  }

  // CIF (simplificado)
  const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$/;
  return cifRegex.test(cleaned);
}

// ─── Teléfono ──────────────────────────────────────────────────────────────────

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  // Formato español: 600 123 456 o +34 600 123 456
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("+34") && cleaned.length === 12) {
    return `+34 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

// ─── Texto ─────────────────────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
