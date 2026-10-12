import { prisma } from '../config/database';
import { PackageName } from '@prisma/client';

export const packageRepository = {
  findAll: () =>
    prisma.package.findMany({ orderBy: { sortOrder: 'asc' } }),

  findById: (id: string) =>
    prisma.package.findUnique({ where: { id } }),

  findByName: (name: PackageName) =>
    prisma.package.findUnique({ where: { name } }),
};
