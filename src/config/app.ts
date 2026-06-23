/**
 * src/config/app.ts
 * Constantes globales de la aplicación.
 */

export const APP_CONFIG = {
  name: "OfiGest",
  version: "0.1.0",
  description: "Gestión digital para gremios técnicos",
  supportEmail: "soporte@ofigest.app",

  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  auth: {
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    passwordMinLength: 8,
    sessionCookieName: "ofigest_session",
    refreshCookieName: "ofigest_refresh",
  },

  upload: {
    maxFileSizeMB: 10,
    allowedImageTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedDocumentTypes: ["application/pdf"],
  },

  // Países soportados (para formateo fiscal)
  locales: {
    default: "es-ES",
    currency: "EUR",
    timezone: "Europe/Madrid",
    dateFormat: "dd/MM/yyyy",
  },
} as const;

// Rutas de la aplicación (evitar strings mágicos)
export const ROUTES = {
  home: "/",
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    verifyEmail: "/verify-email",
  },
  dashboard: {
    home: "/dashboard",
    customers: "/customers",
    leads: "/leads",
    quotes: "/quotes",
    jobs: "/jobs",
    invoices: "/invoices",
    routes: "/routes",
    settings: {
      company: "/settings/company",
      users: "/settings/users",
      roles: "/settings/roles",
    },
  },
  api: {
    auth: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      refresh: "/api/auth/refresh",
      forgotPassword: "/api/auth/forgot-password",
      verifyEmail: "/api/auth/verify-email",
    },
    customers: "/api/customers",
    leads: "/api/leads",
    quotes: "/api/quotes",
    jobs: "/api/jobs",
    invoices: "/api/invoices",
    dashboard: "/api/dashboard",
  },
} as const;
