/**
 * src/application/shared/PaginationDto.ts
 */

import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional().default("asc"),
  search: z.string().optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
