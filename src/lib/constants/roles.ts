/**
 * src/lib/constants/roles.ts
 * Matriz de permisos por rol.
 * Single source of truth para RBAC en toda la aplicación.
 */

import { type Permission, type UserRole } from "@/lib/types";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    "customers:read",
    "customers:write",
    "customers:delete",
    "leads:read",
    "leads:write",
    "leads:delete",
    "quotes:read",
    "quotes:write",
    "quotes:delete",
    "jobs:read",
    "jobs:write",
    "jobs:delete",
    "invoices:read",
    "invoices:write",
    "invoices:delete",
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
    "users:delete",
    "reports:read",
  ],

  OFICINA: [
    "customers:read",
    "customers:write",
    "leads:read",
    "leads:write",
    "quotes:read",
    "quotes:write",
    "jobs:read",
    "jobs:write",
    "invoices:read",
    "invoices:write",
    "users:read",
    "reports:read",
  ],

  TECNICO: [
    "jobs:read",
    "jobs:write",
    // Solo puede ver y actualizar sus propios trabajos
    // La restricción adicional se aplica en el use case
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  OFICINA: "Oficina",
  TECNICO: "Técnico",
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
