/**
 * src/lib/utils/cn.ts
 * Combina clsx con tailwind-merge para gestión correcta de clases de Tailwind.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
