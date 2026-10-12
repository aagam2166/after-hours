import { BookingStatus } from '@prisma/client';
import { prisma } from '../config/database';

// Prototype: max bookings per 2-hour slot per day
const MAX_CONCURRENT_BOOKINGS = 5;

// Available time slots (24-hr format)
export const AVAILABLE_SLOTS = [
  '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30',
  '00:00', '00:30', '01:00', '01:30',
];

export const availabilityService = {
  async checkSlot(date: Date, time: string): Promise<{ available: boolean; reason?: string }> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const activeStatuses: BookingStatus[] = [
      'SLOT_HELD', 'AWAITING_PAYMENT', 'CONFIRMED',
      'CREW_ASSIGNED', 'CREW_ON_THE_WAY', 'CREW_ARRIVED', 'RESET_IN_PROGRESS',
    ];

    const bookingsCount = await prisma.booking.count({
      where: {
        scheduledDate: { gte: dayStart, lte: dayEnd },
        scheduledTime: time,
        status: { in: activeStatuses },
      },
    });

    if (bookingsCount >= MAX_CONCURRENT_BOOKINGS) {
      return { available: false, reason: 'SLOT_FULL' };
    }

    return { available: true };
  },

  async getNextAvailableSlots(
    fromDate: Date,
    count = 3
  ): Promise<Array<{ date: string; time: string }>> {
    const slots: Array<{ date: string; time: string }> = [];
    const checkDate = new Date(fromDate);

    while (slots.length < count) {
      for (const time of AVAILABLE_SLOTS) {
        if (slots.length >= count) break;
        const result = await availabilityService.checkSlot(checkDate, time);
        if (result.available) {
          slots.push({
            date: checkDate.toISOString().split('T')[0],
            time,
          });
        }
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    return slots;
  },
};
