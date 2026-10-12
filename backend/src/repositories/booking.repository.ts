import { prisma } from '../config/database';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export const bookingRepository = {
  create: (userId: string) =>
    prisma.booking.create({
      data: { userId, status: 'DRAFT' },
      include: { package: true, photos: true, rating: true },
    }),

  findById: (id: string) =>
    prisma.booking.findUnique({
      where: { id },
      include: { package: true, photos: true, rating: true, user: true },
    }),

  findByUserId: (userId: string) =>
    prisma.booking.findMany({
      where: { userId, status: { not: 'DRAFT' } },
      include: { package: true, photos: true, rating: true },
      orderBy: { createdAt: 'desc' },
    }),

  update: (
    id: string,
    data: Parameters<typeof prisma.booking.update>[0]['data']
  ) =>
    prisma.booking.update({
      where: { id },
      data,
      include: { package: true, photos: true, rating: true },
    }),

  updateStatus: (id: string, status: BookingStatus) =>
    prisma.booking.update({ where: { id }, data: { status } }),

  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) =>
    prisma.booking.update({ where: { id }, data: { paymentStatus } }),

  addPhoto: (bookingId: string, url: string) =>
    prisma.bookingPhoto.create({ data: { bookingId, url } }),

  removePhoto: (photoId: string) =>
    prisma.bookingPhoto.delete({ where: { id: photoId } }),

  createRating: (data: {
    bookingId: string;
    userId: string;
    score: number;
    label: string;
    feedback?: string;
  }) => prisma.rating.create({ data }),

  findRatingByBookingId: (bookingId: string) =>
    prisma.rating.findUnique({ where: { bookingId } }),
};
