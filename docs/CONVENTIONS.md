# OfiGest — Convenciones de Código

## Reglas generales

1. **Un archivo, una responsabilidad.** Un Use Case = un archivo. Una entidad = un archivo.
2. **Nombres que se explican solos.** Si necesitas un comentario para explicar el nombre, el nombre es malo.
3. **TypeScript estricto.** `strict: true` en tsconfig, sin `any` salvo excepciones justificadas.
4. **Sin console.log en producción.** Usa el logger centralizado (a implementar en Fase 3).
5. **Errores de dominio, siempre.** Nunca lanzar `new Error("mensaje")`. Usar las clases de `domain/shared/errors/`.

---

## Estructura de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(customers): add pagination to customer list
fix(auth): refresh token not rotating on mobile
chore(deps): update prisma to 6.1
docs(api): document quote endpoints
refactor(jobs): extract status validation to domain
test(customers): add unit tests for CreateCustomerUseCase
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

---

## Nomenclatura por tipo de archivo

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componente React | PascalCase | `CustomerTable.tsx` |
| Hook de React | `use` + PascalCase | `useCustomers.ts` |
| Use Case | PascalCase + `UseCase` | `CreateCustomerUseCase.ts` |
| Interfaz repo | `I` + PascalCase | `ICustomerRepository.ts` |
| Impl Prisma repo | `Prisma` + PascalCase | `PrismaCustomerRepository.ts` |
| DTO | PascalCase + `Dto` | `CreateCustomerDto.ts` |
| Mapper | PascalCase + `Mapper` | `CustomerMapper.ts` |
| Schema Zod | camelCase + `Schema` | `createCustomerSchema` |
| Constante | UPPER_SNAKE | `MAX_PAGE_SIZE` |
| Tipo/Interfaz TS | PascalCase | `CustomerListResponse` |

---

## API Routes — Patrón estándar

```typescript
// app/api/resource/route.ts

import { NextRequest } from "next/server";
import { z } from "zod";
import { successResponse, errorResponse } from "@/application/shared/ResponseWrapper";
import { getTenantContext } from "@/lib/auth/session";

const inputSchema = z.object({ ... });

export async function GET(request: NextRequest) {
  try {
    // 1. Contexto de tenant (verifica JWT + extrae companyId)
    const ctx = await getTenantContext(request);

    // 2. Validar input
    const { searchParams } = new URL(request.url);
    const input = inputSchema.parse(Object.fromEntries(searchParams));

    // 3. Llamar Use Case (DI manual)
    const repo = new PrismaXxxRepository();
    const useCase = new ListXxxUseCase(repo);
    const result = await useCase.execute({ ...input, companyId: ctx.companyId });

    // 4. Respuesta
    return successResponse(result.data, 200, result.meta);
  } catch (error) {
    return errorResponse(error);
  }
}
```

---

## Use Cases — Patrón estándar

```typescript
// domain/xxx/use-cases/CreateXxxUseCase.ts

import { IUseCase, TenantContext } from "@/domain/shared/interfaces/IUseCase";
import { IXxxRepository } from "../repositories/IXxxRepository";
import { ValidationError } from "@/domain/shared/errors/DomainError";

interface Input extends TenantContext {
  name: string;
  // ...
}

interface Output {
  id: string;
  name: string;
  // ...
}

export class CreateXxxUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repo: IXxxRepository) {}

  async execute(input: Input): Promise<Output> {
    // 1. Validaciones de dominio
    if (!input.name.trim()) {
      throw new ValidationError("El nombre es obligatorio", {
        name: ["El nombre no puede estar vacío"],
      });
    }

    // 2. Lógica de negocio
    const entity = await this.repo.create({
      companyId: input.companyId,
      name: input.name.trim(),
    });

    // 3. Return
    return entity;
  }
}
```

---

## Reglas de seguridad (obligatorias)

1. **Nunca confiar en el `companyId` del body.** Siempre extraerlo del JWT.
2. **Validar con Zod antes de tocar la DB.** Sin excepciones.
3. **Todos los queries de Prisma incluyen `where: { companyId }`.**
4. **Contraseñas: mínimo bcrypt cost=12.**
5. **Sin logs de datos personales** (emails, teléfonos, NIF) en producción.
6. **Rate limiting en endpoints de auth** (implementar en Fase 3).
7. **Sanitizar inputs antes de guardar.** Trim() mínimo en todos los strings.

---

## Flujo de trabajo por feature

```
1. Crear rama: git checkout -b feat/nombre-feature
2. Añadir entidad al schema.prisma (si aplica)
3. Crear/actualizar interfaces de repositorio (domain/)
4. Implementar Use Cases (domain/use-cases/)
5. Implementar repositorio Prisma (infrastructure/)
6. Crear API Route (app/api/)
7. Crear componentes UI (components/)
8. Crear página (app/(dashboard)/)
9. Escribir tests unitarios para Use Cases
10. PR con descripción de cambios
```
