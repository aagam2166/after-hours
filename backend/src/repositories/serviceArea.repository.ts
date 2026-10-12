import { prisma } from '../config/database';

export const serviceAreaRepository = {
  findByPincode: (pincode: string) =>
    prisma.serviceArea.findUnique({ where: { pincode } }),

  isServiceable: async (pincode: string): Promise<boolean> => {
    const area = await prisma.serviceArea.findUnique({ where: { pincode } });
    return !!area?.active;
  },

  findAll: () => prisma.serviceArea.findMany({ orderBy: { pincode: 'asc' } }),
};
