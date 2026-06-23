# OfiGest — Arquitectura del Sistema

## Visión General

OfiGest es un SaaS multi-tenant B2B orientado a gremios técnicos (electricistas, fontaneros, instaladores solares, HVAC, reformistas). Sustituye flujos en papel, Excel y WhatsApp por una plataforma digital integrada.

---

## Capas de la Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│           Next.js 15 App Router (RSC + Client)              │
│           Tailwind CSS + Shadcn UI + Radix Primitives       │
└─────────────────┬───────────────────────────────────────────┘
                  │  HTTP / API Routes
┌─────────────────▼───────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│     Use Cases · DTOs · Input Validation (Zod) · Mappers    │
└─────────────────┬───────────────────────────────────────────┘
                  │  Interfaces / Ports
┌─────────────────▼───────────────────────────────────────────┐
│                    DOMAIN LAYER                              │
│    Entities · Value Objects · Domain Events · Errors        │
│             Repository Interfaces · Aggregates              │
└─────────────────┬───────────────────────────────────────────┘
                  │  Adapters / Implementations
┌─────────────────▼───────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│    Prisma ORM · PostgreSQL · JWT · S3/MinIO · SMTP          │
│    OpenAI · Google Maps · PDF Generator                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Arquitectura Multi-Tenant

### Estrategia: Schema-per-Tenant → Row-Level (elegida)

Se usa **Row-Level Multi-Tenancy** con campo `tenantId` en todas las entidades.  
Es más simple de operar, suficiente para la escala inicial y permite migraciones atómicas.

```
┌──────────────────────────────────────────────────────┐
│                   PostgreSQL                          │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │              public schema                     │  │
│  │                                                │  │
│  │  companies (tenants)                           │  │
│  │    ├── users         [companyId FK]            │  │
│  │    ├── customers     [companyId FK]            │  │
│  │    ├── quotes        [companyId FK]            │  │
│  │    ├── jobs          [companyId FK]            │  │
│  │    ├── invoices      [companyId FK]            │  │
│  │    └── ...           [companyId FK]            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Aislamiento de datos

1. Cada API Route extrae el `companyId` del JWT.
2. El middleware inyecta el `companyId` en el contexto de la request.
3. Todos los repositorios filtran SIEMPRE por `companyId`.
4. El `TenantGuard` en el middleware intercepta cualquier acceso sin tenant.

---

## Estructura de Dominios (DDD)

```
domain/
├── auth/           → Usuarios, sesiones, tokens, permisos
├── customers/      → Clientes, contactos, historial
├── leads/          → Pipeline CRM, etapas, conversiones
├── quotes/         → Presupuestos, líneas, estados
├── jobs/           → Órdenes de trabajo, asignaciones
├── invoices/       → Facturas, pagos, fiscalidad
├── notifications/  → Alertas internas y externas
└── shared/         → Errores base, interfaces, value-objects comunes
```

Cada dominio tiene la misma anatomía interna:

```
domain/{name}/
├── entities/           → Clases de entidad con lógica de negocio
├── value-objects/      → Objetos inmutables (Email, Phone, Money…)
├── repositories/       → Interfaces (contratos), nunca implementación
├── use-cases/          → Un archivo por caso de uso
└── errors/             → Errores de dominio específicos
```

---

## Estructura de Carpetas Completa

```
ofigest/
│
├── src/
│   │
│   ├── app/                          ← Next.js App Router
│   │   ├── (auth)/                   ← Rutas públicas de autenticación
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify-email/
│   │   │
│   │   ├── (dashboard)/              ← Rutas protegidas (requieren auth)
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── leads/
│   │   │   ├── quotes/
│   │   │   ├── jobs/
│   │   │   ├── invoices/
│   │   │   ├── routes/
│   │   │   └── settings/
│   │   │       ├── company/
│   │   │       ├── users/
│   │   │       └── roles/
│   │   │
│   │   ├── api/                      ← Next.js API Routes (REST)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   ├── forgot-password/route.ts
│   │   │   │   └── verify-email/route.ts
│   │   │   ├── customers/
│   │   │   │   ├── route.ts              (GET list, POST create)
│   │   │   │   └── [id]/route.ts         (GET, PUT, DELETE)
│   │   │   ├── leads/route.ts
│   │   │   ├── quotes/route.ts
│   │   │   ├── jobs/route.ts
│   │   │   ├── invoices/route.ts
│   │   │   ├── notifications/route.ts
│   │   │   ├── files/route.ts
│   │   │   ├── routes/route.ts
│   │   │   └── dashboard/route.ts
│   │   │
│   │   ├── layout.tsx                ← Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── domain/                       ← CORE: reglas de negocio puras
│   │   ├── auth/
│   │   │   ├── entities/
│   │   │   │   ├── User.ts
│   │   │   │   ├── Role.ts
│   │   │   │   └── Permission.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Email.ts
│   │   │   │   ├── Password.ts
│   │   │   │   └── Token.ts
│   │   │   ├── repositories/
│   │   │   │   └── IUserRepository.ts
│   │   │   └── use-cases/
│   │   │       ├── LoginUseCase.ts
│   │   │       ├── RegisterUseCase.ts
│   │   │       └── RefreshTokenUseCase.ts
│   │   │
│   │   ├── customers/
│   │   │   ├── entities/Customer.ts
│   │   │   ├── value-objects/Phone.ts
│   │   │   ├── repositories/ICustomerRepository.ts
│   │   │   └── use-cases/
│   │   │       ├── CreateCustomerUseCase.ts
│   │   │       ├── UpdateCustomerUseCase.ts
│   │   │       ├── DeleteCustomerUseCase.ts
│   │   │       └── ListCustomersUseCase.ts
│   │   │
│   │   ├── leads/
│   │   ├── quotes/
│   │   ├── jobs/
│   │   ├── invoices/
│   │   │
│   │   └── shared/
│   │       ├── errors/
│   │       │   ├── DomainError.ts
│   │       │   ├── NotFoundError.ts
│   │       │   ├── UnauthorizedError.ts
│   │       │   ├── ForbiddenError.ts
│   │       │   └── ValidationError.ts
│   │       ├── value-objects/
│   │       │   ├── UniqueId.ts
│   │       │   └── Money.ts
│   │       └── interfaces/
│   │           ├── IRepository.ts
│   │           └── IUseCase.ts
│   │
│   ├── application/                  ← Orquestación: DTOs, servicios de app
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── LoginDto.ts
│   │   │   │   └── RegisterDto.ts
│   │   │   └── mappers/
│   │   │       └── UserMapper.ts
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── quotes/
│   │   ├── jobs/
│   │   ├── invoices/
│   │   ├── dashboard/
│   │   └── shared/
│   │       ├── PaginationDto.ts
│   │       └── ResponseWrapper.ts
│   │
│   ├── infrastructure/               ← Implementaciones concretas
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   └── client.ts         ← Singleton PrismaClient
│   │   │   └── repositories/         ← Implementaciones Prisma de IRepository
│   │   │       ├── PrismaUserRepository.ts
│   │   │       ├── PrismaCustomerRepository.ts
│   │   │       └── ...
│   │   ├── auth/
│   │   │   ├── JwtService.ts
│   │   │   └── BcryptService.ts
│   │   ├── email/
│   │   │   └── EmailService.ts       ← Nodemailer / Resend
│   │   ├── storage/
│   │   │   └── StorageService.ts     ← S3 / MinIO
│   │   ├── pdf/
│   │   │   └── PdfService.ts         ← Puppeteer / React-PDF
│   │   ├── ai/
│   │   │   └── AiService.ts          ← OpenAI
│   │   └── maps/
│   │       └── MapsService.ts        ← Google Maps API
│   │
│   ├── components/                   ← UI Components
│   │   ├── ui/                       ← Re-exports Shadcn UI
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── forms/
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── QuoteForm.tsx
│   │   │   └── ...
│   │   ├── tables/
│   │   │   ├── DataTable.tsx         ← Tabla genérica reutilizable
│   │   │   └── ...
│   │   ├── charts/
│   │   ├── modals/
│   │   ├── shared/
│   │   │   ├── PageHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   └── dashboard/
│   │       ├── StatCard.tsx
│   │       └── RecentActivity.tsx
│   │
│   ├── lib/                          ← Utilidades transversales
│   │   ├── utils/
│   │   │   ├── cn.ts                 ← clsx + tailwind-merge
│   │   │   ├── format.ts             ← fechas, moneda, NIF
│   │   │   └── slugify.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useToast.ts
│   │   ├── validators/
│   │   │   └── schemas.ts            ← Zod schemas compartidos
│   │   ├── constants/
│   │   │   ├── roles.ts
│   │   │   ├── status.ts
│   │   │   └── routes.ts
│   │   ├── types/
│   │   │   └── index.ts              ← Tipos globales TypeScript
│   │   ├── api/
│   │   │   └── client.ts             ← Fetch wrapper del cliente
│   │   └── auth/
│   │       └── session.ts            ← Helpers de sesión cliente
│   │
│   ├── middleware/
│   │   └── index.ts                  ← Next.js middleware (auth + tenant)
│   │
│   └── config/
│       ├── env.ts                    ← Variables de entorno tipadas (t3-env)
│       └── app.ts                    ← Constantes de la app
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seeds/
│       ├── index.ts
│       └── data/
│
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── ARCHITECTURE.md               ← Este archivo
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONVENTIONS.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Convenciones de Código

### Nombrado de archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componente React | PascalCase | `CustomerForm.tsx` |
| Hook | camelCase con `use` | `useCustomers.ts` |
| Use Case | PascalCase + `UseCase` | `CreateCustomerUseCase.ts` |
| Repository interface | `I` + PascalCase | `ICustomerRepository.ts` |
| Prisma repo impl | `Prisma` + Name | `PrismaCustomerRepository.ts` |
| API Route | `route.ts` | `customers/route.ts` |
| DTO | PascalCase + `Dto` | `CreateCustomerDto.ts` |
| Mapper | PascalCase + `Mapper` | `CustomerMapper.ts` |
| Schema Zod | camelCase + `Schema` | `createCustomerSchema` |

### Estructura de un Use Case

```typescript
// domain/customers/use-cases/CreateCustomerUseCase.ts
export class CreateCustomerUseCase implements IUseCase<Input, Output> {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly companyRepo: ICompanyRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    // 1. Validar dominio
    // 2. Verificar permisos de tenant
    // 3. Ejecutar lógica de negocio
    // 4. Persistir
    // 5. Retornar
  }
}
```

### Estructura de una API Route

```typescript
// app/api/customers/route.ts
export async function GET(request: NextRequest) {
  // 1. Extraer y validar JWT → getTenantContext(request)
  // 2. Validar input con Zod
  // 3. Llamar al Use Case (inyección de dependencias manual)
  // 4. Retornar respuesta normalizada
}
```

### Respuesta API estándar

```typescript
// Éxito
{ success: true, data: T, meta?: PaginationMeta }

// Error
{ success: false, error: { code: string, message: string, details?: unknown } }
```

### RBAC: Roles y Permisos

```
ADMIN
  └── Acceso total a todo el tenant

OFICINA
  ├── Gestión clientes, presupuestos, facturas
  ├── Lectura de trabajos
  └── Sin acceso a configuración empresa

TECNICO
  ├── Ver trabajos asignados
  ├── Crear partes de trabajo
  └── Sin acceso a clientes ni facturación
```

---

## Flujo de Autenticación

```
Cliente                   Next.js                    PostgreSQL
  │                          │                             │
  │── POST /api/auth/login ──▶│                             │
  │                          │── Buscar usuario ───────────▶│
  │                          │◀─ User + hashed pw ─────────│
  │                          │                             │
  │                          │── bcrypt.compare()          │
  │                          │                             │
  │                          │── Generar access_token (15m)│
  │                          │── Generar refresh_token (7d)│
  │                          │── Guardar refresh en DB ───▶│
  │                          │                             │
  │◀── { access_token } ─────│                             │
  │    [refresh en HttpOnly  │                             │
  │     Cookie segura]       │                             │
```

El `access_token` va en `Authorization: Bearer` header.  
El `refresh_token` va en cookie `HttpOnly; Secure; SameSite=Strict`.

---

## Estrategia de Despliegue

### Entornos

| Entorno | URL | Branch |
|---------|-----|--------|
| Development | localhost:3000 | `feature/*` |
| Staging | staging.ofigest.app | `develop` |
| Production | app.ofigest.app | `main` |

### Stack de infraestructura

```
Internet
    │
    ▼
[Cloudflare CDN / WAF]
    │
    ▼
[Nginx Reverse Proxy]
    ├── /        → Next.js App (puerto 3000)
    └── /minio   → MinIO Storage (puerto 9000)
    │
    ▼
[Docker Compose]
    ├── app       (Next.js 15)
    ├── db        (PostgreSQL 16)
    ├── redis     (Cache + Rate limiting)
    └── minio     (Almacenamiento de archivos)
```

### Variables de entorno requeridas

```bash
# Base de datos
DATABASE_URL=postgresql://user:pass@db:5432/ofigest

# JWT
JWT_SECRET=<min 64 chars>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# App
NEXT_PUBLIC_APP_URL=https://app.ofigest.app
NEXTAUTH_SECRET=<min 32 chars>

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@ofigest.app

# Storage
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=ofigest

# AI (Fase 12)
OPENAI_API_KEY=

# Maps (Fase 11)
GOOGLE_MAPS_API_KEY=
```
