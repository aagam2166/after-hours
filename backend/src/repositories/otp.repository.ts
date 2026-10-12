import { prisma } from '../config/database';

export const otpRepository = {
  create: (mobile: string, code: string, expiresAt: Date) =>
    prisma.otpCode.create({ data: { mobile, code, expiresAt } }),

  findValid: (mobile: string, code: string) =>
    prisma.otpCode.findFirst({
      where: {
        mobile,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    }),

  markUsed: (id: string) =>
    prisma.otpCode.update({ where: { id }, data: { used: true } }),

  deleteExpiredForMobile: (mobile: string) =>
    prisma.otpCode.deleteMany({
      where: { mobile, expiresAt: { lt: new Date() } },
    }),
};
