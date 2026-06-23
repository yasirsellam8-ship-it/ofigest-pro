import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaCompanyRepository {
  async findByTaxId(taxId: string) {
    return prisma.company.findUnique({ where: { taxId } });
  }

  async create(data: any) {
    return prisma.company.create({ data });
  }
}