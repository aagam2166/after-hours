import { prisma } from '../config/database';

export const userRepository = {
  findByMobile: (mobile: string) =>
    prisma.user.findUnique({ where: { mobile } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  create: (data: { mobile: string; name?: string; email?: string }) =>
    prisma.user.create({ data }),

  update: (id: string, data: Partial<{ name: string; email: string; verified: boolean }>) =>
    prisma.user.update({ where: { id }, data }),

  upsertByMobile: (mobile: string) =>
    prisma.user.upsert({
      where: { mobile },
      update: {},
      create: { mobile },
    }),
};
